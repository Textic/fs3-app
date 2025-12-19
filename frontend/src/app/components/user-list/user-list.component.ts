import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LaboratorioService } from '../../services/laboratorio';
import { User, Laboratorio } from '../../models';
import { ConfirmModalComponent } from '../modal/confirm-modal.component';

@Component({
	selector: 'app-user-list',
	standalone: true,
	imports: [CommonModule, FormsModule, ConfirmModalComponent],
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
	users: User[] = [];
	laboratorios: Laboratorio[] = [];
	public currentUser: User | null = null;
	errorMessage: string = '';

	showModal = false;
	userToDelete: number | null = null;

	constructor(
		private authService: AuthService,
		private laboratorioService: LaboratorioService,
		private cdr: ChangeDetectorRef
	) {
		this.currentUser = this.authService.currentUserValue;
	}

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
		this.userToDelete = id;
		this.showModal = true;
	}

	confirmDelete(): void {
		if (this.userToDelete === null) return;

		this.authService.deleteUser(this.userToDelete).subscribe({
			next: () => {
				this.users = this.users.filter(u => u.id !== this.userToDelete);
				this.closeModal();
			},
			error: (err) => {
				console.error('Error deleting user:', err);
				this.errorMessage = 'Error al eliminar usuario: ' + (typeof err.error === 'string' ? err.error : (err.error?.message || err.statusText || err.message));
				this.closeModal();
			}
		});
	}

	closeModal(): void {
		this.showModal = false;
		this.userToDelete = null;
	}

	assignLab(user: User, labId: number): void {
		if (!user.id) return;

		if (labId === -1) {
			this.authService.removeLab(user.id).subscribe({
				next: (updatedUser) => {
					user.laboratorioId = undefined; // or null depending on model
					user.laboratorio = null;
					alert('Laboratorio desasignado correctamente');
				},
				error: (err) => {
					this.errorMessage = 'Error al desasignar laboratorio';
					this.loadUsers(); // revert
				}
			});
		} else {
			this.authService.assignLab(user.id, labId).subscribe({
				next: (updatedUser) => {
					user.laboratorioId = labId;
					alert('Laboratorio asignado correctamente');
				},
				error: (err) => {
					this.errorMessage = 'Error al asignar laboratorio';
					this.loadUsers(); // revert
				}
			});
		}
	}

	// Helper to handle select change
	onLabChange(user: User, event: Event): void {
		const selectElement = event.target as HTMLSelectElement;
		const val = selectElement.value;
		// Handle legacy null or new -1
		const labId = (val === 'null' || val === '' || val === '-1') ? -1 : Number(val);
		this.assignLab(user, labId);
	}

	onRoleChange(user: User, event: Event): void {
		const selectElement = event.target as HTMLSelectElement;
		const newRole = selectElement.value;

		if (!user.id) return;
		if (user.id === this.currentUser?.id) {
			alert('No puedes cambiar tu propio rol.');
			// Reset selection if needed (complex without binding refresh, but alert is enough for now)
			return;
		}

		if (confirm(`¿Estás seguro de cambiar el rol de ${user.username} a ${newRole}?`)) {
			this.authService.updateUser(user.id, { rol: newRole }).subscribe({
				next: (updatedUser) => {
					user.rol = newRole;
					alert('Rol actualizado correctamente');
				},
				error: (err) => {
					console.error(err);
					this.errorMessage = 'Error al actualizar el rol';
					// Revert change in UI if possible or reload
					this.loadUsers();
				}
			});
		} else {
			// Revert selection visually if cancelled (optional, requires 2-way binding to be robust)
			this.loadUsers();
		}
	}
}
