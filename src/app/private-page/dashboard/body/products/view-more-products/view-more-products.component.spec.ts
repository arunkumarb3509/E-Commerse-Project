import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoreProductsComponent } from './view-more-products.component';

describe('ViewMoreProductsComponent', () => {
  let component: ViewMoreProductsComponent;
  let fixture: ComponentFixture<ViewMoreProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMoreProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMoreProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
