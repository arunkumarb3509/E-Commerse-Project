import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategoryGridComponent } from './main-category-grid.component';

describe('MainCategoryGridComponent', () => {
  let component: MainCategoryGridComponent;
  let fixture: ComponentFixture<MainCategoryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCategoryGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCategoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
