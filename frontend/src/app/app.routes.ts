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
	{ path: 'laboratorios', component: LaboratorioListComponent, canActivate: [authGuard] },
	{ path: 'laboratorios/new', component: LaboratorioFormComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'laboratorios/edit/:id', component: LaboratorioFormComponent, canActivate: [authGuard, adminGuard] },
	{ path: '**', redirectTo: '/login' }
];
