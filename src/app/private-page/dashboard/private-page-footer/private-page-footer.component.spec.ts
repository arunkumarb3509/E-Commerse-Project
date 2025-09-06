import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatePageFooterComponent } from './private-page-footer.component';

describe('PrivatePageFooterComponent', () => {
  let component: PrivatePageFooterComponent;
  let fixture: ComponentFixture<PrivatePageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivatePageFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivatePageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
