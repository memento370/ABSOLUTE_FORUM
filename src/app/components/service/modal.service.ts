import { Injectable, ComponentRef, ApplicationRef, Injector, ComponentFactoryResolver, EmbeddedViewRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRef: ComponentRef<any> | null = null;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  open(component: any) {
    if (this.modalRef) {
      this.close();
    }

    const factory = this.resolver.resolveComponentFactory(component);
    this.modalRef = factory.create(this.injector);

    this.appRef.attachView(this.modalRef.hostView);

    const domElem = (this.modalRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  close() {
    if (this.modalRef) {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
      this.modalRef = null;
    }
  }
}
