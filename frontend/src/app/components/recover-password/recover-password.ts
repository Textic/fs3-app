import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css'
})
export class RecoverPasswordComponent {
  user: User = {
    username: '',
    password: '', // New password
    email: ''
  };
  error = '';
  success = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.recover(this.user).subscribe({
      next: () => {
        this.success = 'Contraseña actualizada exitosamente.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = 'Error al actualizar contraseña. Verifique el usuario.';
        this.loading = false;
      }
    });
  }
}
