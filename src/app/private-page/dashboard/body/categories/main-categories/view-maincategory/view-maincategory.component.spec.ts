import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaincategoryComponent } from './view-maincategory.component';

describe('ViewMaincategoryComponent', () => {
  let component: ViewMaincategoryComponent;
  let fixture: ComponentFixture<ViewMaincategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMaincategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMaincategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
