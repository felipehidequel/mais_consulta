import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoAtendimentosComponent } from './historico-atendimentos.component';

describe('HistoricoAtendimentosComponent', () => {
  let component: HistoricoAtendimentosComponent;
  let fixture: ComponentFixture<HistoricoAtendimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoAtendimentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoricoAtendimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
