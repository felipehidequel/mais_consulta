import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PacienteFormComponent } from '../paciente-form/paciente-form.component';
import { PacienteService } from '../services/paciente.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { ConsultaService } from '../services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consulta } from '../class/Consulta';

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

  createFutureConsultas(pacienteId: number) {

    this.pacienteService.getPacienteById(pacienteId).subscribe(
      (pacienteCompleto) => {
        pacienteCompleto.quantidadeConsulta = 0; // Zera a quantidade de consultas
        this.pacienteService.updatePaciente(pacienteId, pacienteCompleto).subscribe(
          () => {
            this.consultaService.getUltimaConsultaByPacienteId(pacienteId).subscribe(
              (consultas) => {
                if (consultas.length > 0) {
                  const ultimaConsulta = consultas[0];
                  const ultimaData = new Date(ultimaConsulta.data); // Data da última consulta

                  // Acesse a disponibilidade da última consulta
                  const disponibilidadeId = ultimaConsulta.disponibilidade.id;

                  if (disponibilidadeId === undefined) {
                    console.error('ID da disponibilidade não está definido.');
                    return; // Retorna se o ID não estiver definido
                  }

                  const disponibilidade = {
                    id: disponibilidadeId,
                    is_disponivel: false // Ajuste conforme necessário
                  };

                  // Criar quatro novas consultas
                  const consultasParaCriar = Array.from({ length: 4 }, (_, i) => {
                    const novaData = new Date(ultimaData);
                    novaData.setDate(ultimaData.getDate() + ((i + 1) * 6));
                    return {
                      data: novaData.toISOString().split('T')[0],
                      disponibilidade,
                      paciente: pacienteCompleto
                    };
                  });

                  forkJoin(consultasParaCriar.map(consulta =>
                    this.consultaService.createConsulta(consulta)
                  )).subscribe(
                    (resultados) => {
                      console.log('Consultas criadas com sucesso:', resultados);
                      this.snackBar.open('Consultas criadas com sucesso!', 'Fechar', {
                        duration: 3000,
                      });
                    },
                    (error) => {
                      console.error('Erro ao criar consultas:', error);
                      this.snackBar.open('Erro ao criar consultas.', 'Fechar', {
                        duration: 3000,
                      });
                    }
                  );
                } else {
                  console.log('Nenhuma consulta encontrada para criar novas consultas.');
                }
              },
              (error) => {
                console.error('Erro ao buscar a última consulta:', error);
              }
            );
          },
          (error) => {
            console.error('Erro ao zerar a quantidade de consultas:', error);
            this.snackBar.open('Erro ao zerar a quantidade de consultas.', 'Fechar', {
              duration: 3000,
            });
          }
        );
      },
      (error) => {
        console.error('Erro ao obter os dados do paciente:', error);
      }
    );
  }

}