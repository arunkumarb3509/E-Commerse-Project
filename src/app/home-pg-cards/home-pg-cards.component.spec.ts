import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePgCardsComponent } from './home-pg-cards.component';

describe('HomePgCardsComponent', () => {
  let component: HomePgCardsComponent;
  let fixture: ComponentFixture<HomePgCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePgCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePgCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
