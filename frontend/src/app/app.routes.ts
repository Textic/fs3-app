import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { RecoverPasswordComponent } from './components/recover-password/recover-password';
import { LaboratorioListComponent } from './components/laboratorio-list/laboratorio-list';
import { LaboratorioFormComponent } from './components/laboratorio-form/laboratorio-form';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'recover', component: RecoverPasswordComponent },
	{
		path: 'profile',
		loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent),
		canActivate: [authGuard]
	},
	{ path: 'laboratorios', component: LaboratorioListComponent, canActivate: [authGuard] },
	{ path: 'laboratorios/new', component: LaboratorioFormComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'laboratorios/edit/:id', component: LaboratorioFormComponent, canActivate: [authGuard, adminGuard] },
	{
		path: 'resultados',
		loadComponent: () => import('./components/resultado-list/resultado-list').then(m => m.ResultadoListComponent),
		canActivate: [authGuard]
	},
	{
		path: 'resultados/new',
		loadComponent: () => import('./components/resultado-form/resultado-form').then(m => m.ResultadoFormComponent),
		canActivate: [authGuard, adminGuard]
	},
	{
		path: 'resultados/edit/:id',
		loadComponent: () => import('./components/resultado-form/resultado-form').then(m => m.ResultadoFormComponent),
		canActivate: [authGuard, adminGuard]
	},
	{ path: '**', redirectTo: '/login' }
];
