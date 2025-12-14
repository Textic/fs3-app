import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);
	const user = authService.currentUserValue;

	console.log('adminGuard checking user:', user);
	if (user && user.rol !== 'user') {
		console.log('adminGuard: Access granted');
		return true;
	}

	// Redirect to list or home if not authorized
	console.log('adminGuard: Access denied, redirecting to laboratorios');
	router.navigate(['/laboratorios']);
	return false;
};
