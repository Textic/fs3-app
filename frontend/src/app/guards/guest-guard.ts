import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	if (authService.currentUserValue) {
		console.log('guestGuard: User already authenticated, redirecting to home');
		router.navigate(['/laboratorios']); // Redirect to a protected route
		return false;
	}

	return true;
};
