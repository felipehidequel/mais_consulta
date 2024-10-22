import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardConsltaComponent } from './card-conslta.component';

describe('CardConsltaComponent', () => {
  let component: CardConsltaComponent;
  let fixture: ComponentFixture<CardConsltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardConsltaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardConsltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
