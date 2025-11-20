import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ResultadoService } from '../../services/resultado';
import { Resultado } from '../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-resultado-list',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './resultado-list.html',
	styleUrl: './resultado-list.css'
})
export class ResultadoListComponent implements OnInit {
	resultados: Resultado[] = [];
	loading = false;
	error = '';

	constructor(private resultadoService: ResultadoService, private cdr: ChangeDetectorRef) { }

	ngOnInit(): void {
		this.loadResultados();
	}

	loadResultados() {
		console.log('Iniciando carga de resultados...');
		this.loading = true;
		this.resultadoService.getAll()
			.pipe(finalize(() => {
				this.loading = false;
				this.cdr.detectChanges();
			}))
			.subscribe({
				next: (data: Resultado[]) => {
					console.log('Resultados cargados exitosamente:', data);
					this.resultados = data;
				},
				error: (err) => {
					console.error('Error al cargar resultados:', err);
					this.error = 'Error al cargar resultados. Por favor intente nuevamente.';
				}
			});
	}

	deleteResultado(id: number | undefined) {
		if (!id) return;
		if (confirm('¿Está seguro de eliminar este resultado?')) {
			this.resultadoService.delete(id).subscribe({
				next: () => {
					this.loadResultados();
				},
				error: (err) => {
					alert('Error al eliminar resultado');
				}
			});
		}
	}
}
