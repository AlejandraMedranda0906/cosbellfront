import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-float',
  templateUrl: './whatsapp-float.component.html',
  styleUrls: ['./whatsapp-float.component.css']
})
export class WhatsAppFloatComponent {
  goToWhatsApp() {
    window.open('https://wa.me/593979000566', '_blank');
  }
} 