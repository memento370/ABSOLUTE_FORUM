import { Injectable, Type } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private ngbModal: NgbModal) {}

  showComponentInModal<T>(componentType: Type<T>, data: Partial<T>, options?: NgbModalOptions): NgbModalRef {
    const modalRef = this.ngbModal.open(componentType, options);
    Object.assign(modalRef.componentInstance, data);
    return modalRef;
  }
}