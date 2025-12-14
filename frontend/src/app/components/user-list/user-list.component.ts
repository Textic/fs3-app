import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LaboratorioService } from '../../services/laboratorio';
import { User, Laboratorio } from '../../models';

@Component({
	selector: 'app-user-list',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
	users: User[] = [];
	laboratorios: Laboratorio[] = [];
	errorMessage: string = '';

	constructor(
		private authService: AuthService,
		private laboratorioService: LaboratorioService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.loadUsers();
		this.loadLaboratorios();
	}

	loadUsers(): void {
		this.authService.getAllUsers().subscribe({
			next: (data) => {
				console.log('Users loaded:', data);
				this.users = data;
				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Error loading users:', err);
				this.errorMessage = 'Error al cargar usuarios: ' + (err.error?.message || err.statusText || err.message);
			}
		});
	}

	loadLaboratorios(): void {
		this.laboratorioService.getAll().subscribe({
			next: (data) => this.laboratorios = data,
			error: (err) => this.errorMessage = 'Error al cargar laboratorios'
		});
	}

	deleteUser(id: number): void {
		if (confirm('¿Estás seguro de eliminar este usuario?')) {
			this.authService.deleteUser(id).subscribe({
				next: () => {
					this.users = this.users.filter(u => u.id !== id);
				},
				error: (err) => this.errorMessage = 'Error al eliminar usuario'
			});
		}
	}

	assignLab(user: User, labId: number): void {
		if (!user.id) return;
		this.authService.assignLab(user.id, labId).subscribe({
			next: (updatedUser) => {
				// Update local user or just show success
				user.laboratorioId = labId; // Optimistic update or reload if needed
				alert('Laboratorio asignado correctamente');
			},
			error: (err) => this.errorMessage = 'Error al asignar laboratorio'
		});
	}

	// Helper to handle select change
	onLabChange(user: User, event: Event): void {
		const selectElement = event.target as HTMLSelectElement;
		const labId = Number(selectElement.value);
		this.assignLab(user, labId);
	}
}
