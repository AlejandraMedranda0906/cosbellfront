import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiciosComponent } from './admin-servicios.component';

describe('AdminServiciosComponent', () => {
  let component: AdminServiciosComponent;
  let fixture: ComponentFixture<AdminServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
