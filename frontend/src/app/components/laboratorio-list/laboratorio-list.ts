import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LaboratorioService } from '../../services/laboratorio';
import { AuthService } from '../../services/auth';
import { Laboratorio } from '../../models';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ConfirmModalComponent } from '../modal/confirm-modal.component';

@Component({
  selector: 'app-laboratorio-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmModalComponent],
  templateUrl: './laboratorio-list.html',
  styleUrl: './laboratorio-list.css'
})
export class LaboratorioListComponent implements OnInit {
  laboratorios: Laboratorio[] = [];
  loading = false;
  error = '';

  showModal = false;
  labToDelete: number | null = null;

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
    this.labToDelete = id;
    this.showModal = true;
  }

  confirmDelete() {
    if (this.labToDelete === null) return;

    this.laboratorioService.delete(this.labToDelete).subscribe({
      next: () => {
        this.laboratorios = this.laboratorios.filter(l => l.id !== this.labToDelete);
        this.closeModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Error al eliminar laboratorio');
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.labToDelete = null;
  }
}
