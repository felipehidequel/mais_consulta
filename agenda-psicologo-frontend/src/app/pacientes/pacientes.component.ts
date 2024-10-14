import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { PacienteFormComponent } from '../paciente-form/paciente-form.component';
@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [SidebarComponent, PacienteFormComponent, MatDialogModule], // Inclua MatDialogModule aqui
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent {
  constructor(public dialog: MatDialog) { }

  openForm(paciente: any = null) {
    const dialogRef = this.dialog.open(PacienteFormComponent, {
      width: '400px',
      data: { paciente: paciente },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Atualizar a lista ou qualquer outra ação após fechar o popup
      }
    });
  }
}
