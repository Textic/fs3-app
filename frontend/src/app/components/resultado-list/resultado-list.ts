import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
	resultados$!: Observable<Resultado[]>;
	loading = false;
	error = '';

	constructor(private resultadoService: ResultadoService) { }

	ngOnInit(): void {
		this.loadResultados();
	}

	loadResultados() {
		this.loading = true;
		this.resultados$ = this.resultadoService.getAll().pipe(
			tap(() => this.loading = false),
			catchError(err => {
				console.error('Error loading results', err);
				this.error = 'Error al cargar resultados';
				this.loading = false;
				return of([]);
			})
		);
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
