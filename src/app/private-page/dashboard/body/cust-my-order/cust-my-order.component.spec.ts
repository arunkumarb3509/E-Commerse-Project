import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMyOrderComponent } from './cust-my-order.component';

describe('CustMyOrderComponent', () => {
  let component: CustMyOrderComponent;
  let fixture: ComponentFixture<CustMyOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustMyOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustMyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
