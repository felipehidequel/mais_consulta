import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsInfosComponent } from './cards-infos.component';

describe('CardsInfosComponent', () => {
  let component: CardsInfosComponent;
  let fixture: ComponentFixture<CardsInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsInfosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
