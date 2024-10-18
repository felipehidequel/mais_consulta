import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PacienteFormComponent } from '../paciente-form/paciente-form.component';
import { PacienteService } from '../services/paciente.service'; // Serviço para obter pacientes

@Component({
  selector: 'app-pacientes',
  standalone: true,
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss'],
})
export class PacientesComponent implements OnInit {
  pacientes: any[] = []; // Lista de pacientes

  constructor(public dialog: MatDialog, private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes(); // Carregar a lista de pacientes ao inicializar
  }

  loadPacientes() {
    this.pacienteService.getPacientes().subscribe((data) => {
      this.pacientes = data;
    });
  }

  openForm(paciente: any = null) {
    const dialogRef = this.dialog.open(PacienteFormComponent, {
      width: '400px',
      data: { paciente: paciente }, // Passar o paciente selecionado para edição
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPacientes(); // Recarregar a lista após o fechamento do diálogo
      }
    });
  }
}
