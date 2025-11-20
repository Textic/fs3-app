import { Component, OnInit } from '@angular/core';
import { ResultadoService } from '../../services/resultado';
import { AuthService } from '../../services/auth';
import { LaboratorioService } from '../../services/laboratorio';
import { Resultado, User, Laboratorio } from '../../models';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-resultado-form',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule],
	templateUrl: './resultado-form.html',
	styleUrl: './resultado-form.css'
})
export class ResultadoFormComponent implements OnInit {
	resultado: Resultado = {
		analisis: '',
		fecha: new Date()
	};
	users$: Observable<User[]>;
	laboratorios$: Observable<Laboratorio[]>;
	loading = false;
	error = '';
	isEditMode = false;

	constructor(
		private resultadoService: ResultadoService,
		private authService: AuthService,
		private laboratorioService: LaboratorioService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.users$ = this.authService.getAllUsers();
		this.laboratorios$ = this.laboratorioService.getAll();
	}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.isEditMode = true;
			this.loadResultado(+id);
		}
	}

	loadResultado(id: number) {
		this.resultadoService.getById(id).subscribe({
			next: (data) => {
				this.resultado = data;
				// Ensure dates are handled correctly if needed
			},
			error: (err) => this.error = 'Error al cargar resultado'
		});
	}

	onSubmit() {
		this.loading = true;
		this.error = '';

		if (this.isEditMode && this.resultado.id) {
			this.resultadoService.update(this.resultado.id, this.resultado).subscribe({
				next: () => this.router.navigate(['/resultados']),
				error: (err) => {
					this.error = 'Error al actualizar resultado';
					this.loading = false;
				}
			});
		} else {
			this.resultadoService.create(this.resultado).subscribe({
				next: () => this.router.navigate(['/resultados']),
				error: (err) => {
					this.error = 'Error al crear resultado';
					this.loading = false;
				}
			});
		}
	}

	// Helper to compare objects in select
	compareObjects(o1: any, o2: any): boolean {
		return o1 && o2 ? o1.id === o2.id : o1 === o2;
	}
}
