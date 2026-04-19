import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseComponentComponent } from './purchase-component.component';

describe('PurchaseComponentComponent', () => {
  let component: PurchaseComponentComponent;
  let fixture: ComponentFixture<PurchaseComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
