import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { AuthService } from '../../services/auth';
import { LaboratorioService } from '../../services/laboratorio';
import { of, throwError } from 'rxjs';
import { User, Laboratorio } from '../../models';

describe('UserListComponent', () => {
	let component: UserListComponent;
	let fixture: ComponentFixture<UserListComponent>;
	let authServiceSpy: jasmine.SpyObj<AuthService>;
	let labServiceSpy: jasmine.SpyObj<LaboratorioService>;

	beforeEach(async () => {
		// Creamos los espías
		authServiceSpy = jasmine.createSpyObj('AuthService', ['getAllUsers', 'deleteUser', 'assignLab']);
		labServiceSpy = jasmine.createSpyObj('LaboratorioService', ['getAll']);

		// Valores por defecto
		authServiceSpy.getAllUsers.and.returnValue(of([]));
		labServiceSpy.getAll.and.returnValue(of([]));

		await TestBed.configureTestingModule({
			imports: [UserListComponent], // Componente standalone
			providers: [
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: LaboratorioService, useValue: labServiceSpy }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UserListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load users and labs on init', () => {
		// Mocks completos para evitar errores de TypeScript
		const mockUsers: User[] = [{ id: 1, username: 'u1', email: 'test@test.com', password: '' }];
		// CORRECCIÓN 1: Agregamos dirección y teléfono
		const mockLabs: Laboratorio[] = [{ id: 10, nombre: 'Lab1', direccion: 'Calle Falsa 123', telefono: '555-5555' }];

		authServiceSpy.getAllUsers.and.returnValue(of(mockUsers));
		labServiceSpy.getAll.and.returnValue(of(mockLabs));

		component.ngOnInit();

		expect(component.users.length).toBe(1);
		expect(component.laboratorios.length).toBe(1);
	});

	it('should delete user if confirmed', () => {
		spyOn(window, 'confirm').and.returnValue(true);

		// CORRECCIÓN 2: Devolver 'undefined' para simular void correctamente
		authServiceSpy.deleteUser.and.returnValue(of(undefined));

		// Usuario temporal para la prueba
		component.users = [{ id: 99, username: 'Borrar', email: 'a@a.com', password: '' }];

		component.deleteUser(99);

		expect(authServiceSpy.deleteUser).toHaveBeenCalledWith(99);
		expect(component.users.length).toBe(0);
	});

	it('should assign lab to user', () => {
		spyOn(window, 'alert');
		const mockUser: User = { id: 5, username: 'u5', email: 'u@u.com', password: '' };
		const mockRes: User = { ...mockUser, laboratorioId: 20 };

		authServiceSpy.assignLab.and.returnValue(of(mockRes));

		component.assignLab(mockUser, 20);

		expect(authServiceSpy.assignLab).toHaveBeenCalledWith(5, 20);
		expect(window.alert).toHaveBeenCalledWith('Laboratorio asignado correctamente');
	});

	it('should handle error assigning lab', () => {
		const mockUser: User = { id: 5, username: 'u5', email: 'u@u.com', password: '' };
		authServiceSpy.assignLab.and.returnValue(throwError(() => new Error('Error')));

		component.assignLab(mockUser, 20);

		expect(component.errorMessage).toBe('Error al asignar laboratorio');
	});
	it('should handle error when loading users', () => {
		authServiceSpy.getAllUsers.and.returnValue(throwError(() => { return { statusText: 'Server Error' }; }));
		spyOn(console, 'error'); // Suppress console error override

		component.loadUsers();

		expect(component.errorMessage).toContain('Error al cargar usuarios');
	});

	it('should handle error when loading laboratorios', () => {
		labServiceSpy.getAll.and.returnValue(throwError(() => new Error('API Error')));

		component.loadLaboratorios();

		expect(component.errorMessage).toBe('Error al cargar laboratorios');
	});

	it('should NOT delete user if cancelled', () => {
		spyOn(window, 'confirm').and.returnValue(false);
		component.deleteUser(99);
		expect(authServiceSpy.deleteUser).not.toHaveBeenCalled();
	});

	it('should handle error when deleting user', () => {
		spyOn(window, 'confirm').and.returnValue(true);
		authServiceSpy.deleteUser.and.returnValue(throwError(() => new Error('Delete Error')));

		component.deleteUser(99);

		expect(component.errorMessage).toBe('Error al eliminar usuario');
	});

	it('should trigger assignLab on lab change', () => {
		spyOn(component, 'assignLab');
		const mockUser: User = { id: 1, username: 'test', email: 't@t.com', password: '' };
		const mockEvent = { target: { value: '20' } } as unknown as Event;

		component.onLabChange(mockUser, mockEvent);

		expect(component.assignLab).toHaveBeenCalledWith(mockUser, 20);
	});
});