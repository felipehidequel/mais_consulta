import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PacienteFormComponent } from '../paciente-form/paciente-form.component';
import { PacienteService } from '../services/paciente.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ConsultaService } from '../services/consulta.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MatDialogModule],
  styleUrls: ['./pacientes.component.scss'],
})
export class PacientesComponent implements OnInit {
  pacientes: any[] = [];
  loading: boolean = true;

  constructor(
    public dialog: MatDialog,
    private pacienteService: PacienteService,
    private consultaService: ConsultaService // Injetar o ConsultaService
  ) { }

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes() {
    this.loading = true;
    this.pacienteService.getPacientes().subscribe(
      (data) => {
        this.pacientes = data;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao carregar pacientes:', error);
        this.loading = false;
      }
    );
  }

  openForm(pacienteId: number | null = null) {
    const dialogRef = this.dialog.open(PacienteFormComponent, {
      width: '400px',
      data: { paciente: pacienteId ? this.pacientes.find(p => p.id === pacienteId) : null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPacientes();
      }
    });
  }

  deletePaciente(pacienteId: number) {
    if (confirm("Você tem certeza que deseja deletar este paciente?")) {
      this.pacienteService.deletePaciente(pacienteId).subscribe(
        () => {
          console.log('Paciente deletado com sucesso.');
          this.loadPacientes(); // Recarregar a lista de pacientes
        },
        (error) => {
          console.error('Erro ao deletar paciente:', error);
        }
      );
    }}
  

  deleteAllConsultas(pacienteId: number) { // Adicione o ID do paciente como parâmetro
    if (confirm("Você tem certeza que deseja deletar todas as consultas?")) {
      this.consultaService.deleteAllConsultas().subscribe(
        () => {
          console.log('Todas as consultas deletadas com sucesso.');

          // Aqui você chama deletePaciente passando o pacienteId
          this.deletePaciente(pacienteId); // Chame a função deletePaciente com o ID do paciente

          this.loadPacientes(); // Recarregar a lista de pacientes (ou consultas)
        },
        (error) => {
          console.error('Erro ao deletar todas as consultas:', error);
        }
      );
    }
  }
}
