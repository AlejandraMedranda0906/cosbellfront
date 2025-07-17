import { ChatModalComponent } from './chat-modal.component';

describe('ValorarCitaComponent', () => {
  it('debe mostrar el botón de chat y abrir el modal al hacer click', () => {
    component.cita = { id: 123 };
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button.btn-outline-primary');
    expect(btn).toBeTruthy();
    btn.click();
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('app-chat-modal');
    expect(modal).toBeTruthy();
  });
}); 