import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { User } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './profile.html',
	styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
	user: User = {
		username: '',
		email: '',
		password: ''
	};
	loading = false;
	error = '';
	success = '';

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit(): void {
		const currentUser = this.authService.currentUserValue;
		if (currentUser) {
			this.user = { ...currentUser, password: '' }; // Don't show current password
		} else {
			this.router.navigate(['/login']);
		}
	}

	onSubmit() {
		this.loading = true;
		this.error = '';
		this.success = '';

		// Optional: Add password validation here if changing password
		if (this.user.password) {
			const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
			if (!passwordRegex.test(this.user.password)) {
				this.error = 'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (!@#$%^&*)';
				this.loading = false;
				return;
			}
		}

		this.authService.updateProfile(this.user).subscribe({
			next: () => {
				this.success = 'Perfil actualizado exitosamente.';
				this.loading = false;
				this.user.password = ''; // Clear password field
			},
			error: (err) => {
				this.error = 'Error al actualizar el perfil.';
				this.loading = false;
			}
		});
	}
}
