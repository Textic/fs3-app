import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  user: User = {
    username: '',
    password: '',
    email: ''
  };
  error = '';
  loading = false;

  passwordError = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.passwordError = '';

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (!passwordRegex.test(this.user.password || '')) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (!@#$%^&*)';
      this.loading = false;
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Error al registrar. El usuario ya existe o datos inválidos.';
        this.loading = false;
      }
    });
  }
}
