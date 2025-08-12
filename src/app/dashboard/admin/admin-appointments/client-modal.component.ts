import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserDetails } from '../../../services/user.service';

@Component({
  selector: 'app-client-info-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="client-backdrop" (click)="close.emit()"></div>

  <div class="client-dialog" style="display:block">
    <div class="client-header">
      <h3>Contacto de {{ (contact?.name || userNameFallback || 'Cliente') }}</h3>
      <button class="client-close" (click)="close.emit()">×</button>
    </div>

    <div class="client-body" *ngIf="!loading; else loadingTpl">
      <div class="row"><span>Teléfono:</span><b>{{ contact?.phone || '—' }}</b></div>
      <div class="row"><span>Email:</span><b>{{ contact?.email || '—' }}</b></div>

    </div>

    <ng-template #loadingTpl><div class="loading">Cargando…</div></ng-template>

    <div class="client-footer">
      <button class="client-primary" (click)="close.emit()">Cerrar</button>
    </div>
  </div>
  `,
  styles: [`
    .client-backdrop{position:fixed;inset:0;background:#0006;backdrop-filter:blur(1px);z-index:10000}
    .client-dialog{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      width:min(520px,92vw);background:#fff;border-radius:16px;box-shadow:0 10px 40px #0006;z-index:10001}
    .client-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #eee}
    .client-body{padding:16px 20px;display:grid;gap:10px}
    .row{display:flex;gap:8px;align-items:center}
    .row span{color:#666;min-width:100px}
    .client-footer{padding:12px 20px;border-top:1px solid #eee;display:flex;justify-content:flex-end}
    .client-primary{background:#6b1e5b;color:#fff;border:none;border-radius:10px;padding:8px 14px;cursor:pointer}
    .client-close{border:none;background:transparent;font-size:22px;cursor:pointer;line-height:1}
    .loading{padding:24px 20px;color:#666}
  `]
})
export class ClientInfoModalComponent implements OnInit {
  @Input({ required: true }) userId!: number;
  @Input() userNameFallback?: string;

  // ⬇️ Nuevo: si viene contact, no se hace llamada HTTP
  @Input() contact?: UserDetails;

  @Output() close = new EventEmitter<void>();

  loading = true;

  constructor(private users: UserService) {}

  ngOnInit(): void {
    if (this.contact) {
      // ya tenemos datos desde el padre
      this.loading = false;
      return;
    }
    // Si no hay contact, puedes dejar este fetch o quitarlo para evitar 405:
    this.users.getById(this.userId).subscribe({
      next: data => { this.contact = data; this.loading = false; },
      error: _ => { this.contact = { id: this.userId, name: this.userNameFallback ?? 'Cliente' } as UserDetails; this.loading = false; }
    });
  }
}
