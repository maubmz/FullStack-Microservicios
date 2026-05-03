import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonEditionComponent } from './button-edition.component';

describe('ButtonEditionComponent', () => {
  let component: ButtonEditionComponent;
  let fixture: ComponentFixture<ButtonEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonEditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
