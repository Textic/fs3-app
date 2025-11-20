import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);
	const user = authService.currentUserValue;

	if (user && user.rol !== 'user') {
		return true;
	}

	// Redirect to list or home if not authorized
	router.navigate(['/laboratorios']);
	return false;
};
