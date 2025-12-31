import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustOrderSuccessComponent } from './cust-order-success.component';

describe('CustOrderSuccessComponent', () => {
  let component: CustOrderSuccessComponent;
  let fixture: ComponentFixture<CustOrderSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustOrderSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustOrderSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
