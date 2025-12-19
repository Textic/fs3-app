import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
	let component: ConfirmModalComponent;
	let fixture: ComponentFixture<ConfirmModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfirmModalComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have default title and message', () => {
		expect(component.title).toBe('Confirmación');
		expect(component.message).toBe('¿Estás seguro?');
	});

	it('should accept custom title and message', () => {
		component.title = 'Custom Title';
		component.message = 'Custom Message';
		fixture.detectChanges();

		expect(component.title).toBe('Custom Title');
		expect(component.message).toBe('Custom Message');
	});

	it('should emit confirm event when onConfirm is called', () => {
		spyOn(component.confirm, 'emit');

		component.onConfirm();

		expect(component.confirm.emit).toHaveBeenCalled();
	});

	it('should emit cancel event when onCancel is called', () => {
		spyOn(component.cancel, 'emit');

		component.onCancel();

		expect(component.cancel.emit).toHaveBeenCalled();
	});

	it('should render modal with correct structure', () => {
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector('.modal')).toBeTruthy();
		expect(compiled.querySelector('.modal-title')).toBeTruthy();
		expect(compiled.querySelector('.modal-body')).toBeTruthy();
		expect(compiled.querySelector('.modal-footer')).toBeTruthy();
	});

	it('should have cancel and confirm buttons', () => {
		const compiled = fixture.nativeElement;
		const buttons = compiled.querySelectorAll('button');
		expect(buttons.length).toBe(3); // close btn, cancel btn, confirm btn
	});
});
