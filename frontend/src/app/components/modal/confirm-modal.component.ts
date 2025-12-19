import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-confirm-modal',
	standalone: true,
	imports: [CommonModule],
	template: `
    <div class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" (click)="onCancel()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
            <button type="button" class="btn btn-danger" (click)="onConfirm()">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `,
	styles: []
})
export class ConfirmModalComponent {
	@Input() title: string = 'Confirmación';
	@Input() message: string = '¿Estás seguro?';
	@Output() confirm = new EventEmitter<void>();
	@Output() cancel = new EventEmitter<void>();

	onConfirm() {
		this.confirm.emit();
	}

	onCancel() {
		this.cancel.emit();
	}
}
