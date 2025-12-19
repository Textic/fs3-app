import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { ResultadoService } from '../../services/resultado';
import { Resultado } from '../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ConfirmModalComponent } from '../modal/confirm-modal.component';

import { AuthService } from '../../services/auth';

@Component({
	selector: 'app-resultado-list',
	standalone: true,
	imports: [CommonModule, RouterModule, ConfirmModalComponent],
	templateUrl: './resultado-list.html',
	styleUrl: './resultado-list.css'
})
export class ResultadoListComponent implements OnInit {
	resultados: Resultado[] = [];
	loading = false;
	error = '';

	showModal = false;
	resultToDelete: number | null = null;

	constructor(
		private resultadoService: ResultadoService,
		private cd: ChangeDetectorRef,
		private authService: AuthService
	) { }

	ngOnInit(): void {
		this.loadResultados();
	}

	loadResultados() {
		console.log('Iniciando carga de resultados...');
		this.loading = true;
		this.error = '';
		this.resultadoService.getAll().pipe(
			timeout(5000),
			catchError(err => {
				console.error('Error loading results', err);
				this.error = 'Error al cargar resultados: ' + (err.message || err.statusText || 'Error desconocido');
				this.cd.detectChanges(); // Ensure error is shown
				return of([] as Resultado[]);
			}),
			finalize(() => {
				console.log('Finalizando carga (finalize)');
				this.loading = false;
				this.cd.detectChanges(); // Ensure loading spinner is removed
			})
		).subscribe(data => {
			console.log('Datos recibidos:', data);
			this.resultados = data;
			this.cd.detectChanges(); // Ensure data is rendered
		});
	}

	get isAdmin(): boolean {
		const user = this.authService.currentUserValue;
		return user?.rol === 'admin';
	}

	deleteResultado(id: number | undefined) {
		if (!id) return;
		this.resultToDelete = id;
		this.showModal = true;
	}

	confirmDelete() {
		if (this.resultToDelete === null) return;

		this.resultadoService.delete(this.resultToDelete).subscribe({
			next: () => {
				this.resultados = this.resultados.filter(r => r.id !== this.resultToDelete);
				this.closeModal();
			},
			error: (err) => {
				alert('Error al eliminar resultado');
				this.closeModal();
			}
		});
	}

	closeModal() {
		this.showModal = false;
		this.resultToDelete = null;
		this.cd.detectChanges();
	}


}
