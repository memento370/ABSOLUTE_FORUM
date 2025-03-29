import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div #modalElement class="modal fade show d-block" tabindex="-1" (click)="close($event)">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" (click)="close()"></button>
          </div>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      background: rgba(0, 0, 0, 0.5);
    }
  `]
})
export class ModalComponent {
  @Input() title = 'Modal';
  @ViewChild('modalElement', { static: false }) modalElement!: ElementRef;

  constructor(private el: ElementRef) {}

  close(event?: Event) {
    if (!event || event.target === this.el.nativeElement) {
      document.body.removeChild(this.el.nativeElement);
    }
  }
}
