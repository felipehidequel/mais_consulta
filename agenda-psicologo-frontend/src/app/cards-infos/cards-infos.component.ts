import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cards-infos',
  standalone: true,
  imports: [HttpClientModule, CommonModule], 
  templateUrl: './cards-infos.component.html',
  styleUrls: ['./cards-infos.component.scss']
})
export class CardsInfosComponent {

  Psicologos: any[] = []; 

  constructor(private http: HttpClient) { }

  getPsicologos(): Observable<any> {
    const apiUrl = 'http://127.0.0.1:5000/psicologo';  
    return this.http.get<any>(apiUrl);
  }

  ngOnInit(): void {
    this.getPsicologos().subscribe(
      (data) => {
        this.Psicologos = data;
      },
      (error) => {
        console.error('Erro ao obter psicologo:', error);
      }
    );
  }
}
