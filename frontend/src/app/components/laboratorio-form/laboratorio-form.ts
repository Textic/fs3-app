import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LaboratorioService } from '../../services/laboratorio';
import { Laboratorio } from '../../models';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-laboratorio-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './laboratorio-form.html',
  styleUrl: './laboratorio-form.css'
})
export class LaboratorioFormComponent implements OnInit {
  laboratorio: Laboratorio = {
    nombre: '',
    direccion: '',
    telefono: ''
  };
  isEditMode = false;
  loading = false;
  error = '';

  constructor(
    private laboratorioService: LaboratorioService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadLaboratorio(+id);
    }
  }

  loadLaboratorio(id: number) {
    this.loading = true;
    this.laboratorioService.getById(id).subscribe({
      next: (data) => {
        this.laboratorio = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar el laboratorio';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.laboratorio.id) {
      this.laboratorioService.update(this.laboratorio.id, this.laboratorio).subscribe({
        next: () => {
          this.router.navigate(['/laboratorios']);
        },
        error: (err) => {
          this.error = 'Error al actualizar el laboratorio';
          this.loading = false;
        }
      });
    } else {
      this.laboratorioService.create(this.laboratorio).subscribe({
        next: () => {
          this.router.navigate(['/laboratorios']);
        },
        error: (err) => {
          this.error = 'Error al crear el laboratorio';
          this.loading = false;
        }
      });
    }
  }
}
