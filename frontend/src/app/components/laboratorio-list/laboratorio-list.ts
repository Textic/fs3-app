import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LaboratorioService } from '../../services/laboratorio';
import { AuthService } from '../../services/auth';
import { Laboratorio } from '../../models';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-laboratorio-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './laboratorio-list.html',
  styleUrl: './laboratorio-list.css'
})
export class LaboratorioListComponent implements OnInit {
  laboratorios: Laboratorio[] = [];
  loading = false;
  error = '';

  constructor(
    private laboratorioService: LaboratorioService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadLaboratorios();
  }

  get isUser(): boolean {
    const user = this.authService.currentUserValue;
    return user?.rol === 'user';
  }

  loadLaboratorios() {
    this.loading = true;
    this.laboratorioService.getAll().subscribe({
      next: (data) => {
        this.laboratorios = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar laboratorios';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteLaboratorio(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar este laboratorio?')) {
      this.laboratorioService.delete(id).subscribe({
        next: () => {
          this.laboratorios = this.laboratorios.filter(l => l.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert('Error al eliminar laboratorio');
        }
      });
    }
  }
}
