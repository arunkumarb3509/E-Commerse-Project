import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryGridComponent } from './sub-category-grid.component';

describe('SubCategoryGridComponent', () => {
  let component: SubCategoryGridComponent;
  let fixture: ComponentFixture<SubCategoryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoryGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
