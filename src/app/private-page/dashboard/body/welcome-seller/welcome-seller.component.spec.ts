import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeSellerComponent } from './welcome-seller.component';

describe('WelcomeSellerComponent', () => {
  let component: WelcomeSellerComponent;
  let fixture: ComponentFixture<WelcomeSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeSellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
