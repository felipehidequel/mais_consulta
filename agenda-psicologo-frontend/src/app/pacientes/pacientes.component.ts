import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PacienteFormComponent } from '../paciente-form/paciente-form.component';
import { PacienteService } from '../services/paciente.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { ConsultaService } from '../services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar // Injetar o MatSnackBar para mensagens
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
      // Deletar consultas do paciente primeiro
      this.consultaService.deleteConsultasByPaciente(pacienteId).subscribe(
        () => {
          // Se as consultas foram deletadas com sucesso, então deletar o paciente
          this.pacienteService.deletePaciente(pacienteId).subscribe(
            () => {
              this.loadPacientes(); // Recarregar a lista de pacientes
              this.snackBar.open('Paciente e suas consultas deletadas com sucesso!', 'Fechar', {
                duration: 3000,
              });
            },
            (error) => {
              console.error('Erro ao deletar paciente:', error);
              this.snackBar.open('Erro ao deletar paciente.', 'Fechar', {
                duration: 3000,
              });
            }
          );
        },
        (error) => {
          console.error('Erro ao deletar consultas:', error);
          this.snackBar.open('Erro ao deletar consultas do paciente.', 'Fechar', {
            duration: 3000,
          });
        }
      );
    }
  }
}
