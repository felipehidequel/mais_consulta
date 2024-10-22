import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PacienteService } from '../../services/paciente.service';
import { DisponibilidadeService } from '../../services/disponibilidade.service';
import { ConsultaService } from '../../services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Consulta } from '../../class/Consulta';
import { Disponibilidade } from '../../class/Disponibilidade';
import { Paciente } from '../../class/Paciente';
import { SemanaPipe } from '../../pipes/semana/semana.pipe';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SemanaPipe],
  styleUrls: ['./paciente-form.component.scss'],
})

export class PacienteFormComponent implements OnInit {
  pacienteForm!: FormGroup;
  disponibilidades: Disponibilidade[] = []; // Use o tipo correto
  disponibilidadesPaciente: Disponibilidade[] = []; // Nova propriedade
  isEditMode = false;
  horarioInicio!: string;
  horarioFim!: string;
  diaAtual!: string;
  idAtual!: number;
  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private disponibilidadeService: DisponibilidadeService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PacienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data && data.paciente ? true : false; // Verifique se o paciente foi passado
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEditMode) {
      this.loadPacienteData(this.data.paciente.id); // Passa a ID do paciente
      this.loadDisponibilidades(); // Carrega todas as disponibilidades
      this.loadDisponibilidadesPorPacienteId(this.data.paciente.id); // Carrega as disponibilidades do paciente
    }
    else {
      this.loadDisponibilidades(); // Carrega todas as disponibilidades
    }
  }

  private initializeForm(): void {
    this.pacienteForm = this.fb.group({
      username: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      dataDeNascimento: ['', Validators.required],
      password: ['', Validators.required],
      disponibilidade: ['', this.isEditMode ? [] : [Validators.required]], // Condicional
    });
  }

  private loadDisponibilidades(): void {
    this.disponibilidadeService.getDisponibilidades().subscribe((data: Disponibilidade[]) => {
      this.disponibilidades = data; // Armazena todas as disponibilidades
    }, (error) => {
      this.snackBar.open('Erro ao carregar disponibilidades.', 'Fechar', { duration: 3000 });
    });
  }

  private loadDisponibilidadesPorPacienteId(pacienteId: number): void {
    this.consultaService.getDisponibilidadesPorPacienteId(pacienteId).subscribe((data: Disponibilidade[]) => {
      this.disponibilidadesPaciente = data;

      // Exibindo o JSON recebido no alert
      //alert(JSON.stringify(this.disponibilidadesPaciente, null, 2)); // Formata o JSON com indentação

      if (this.disponibilidadesPaciente && this.disponibilidadesPaciente.length > 0) {
        // Acessando a primeira disponibilidade
        const primeiraDisponibilidade = (this.disponibilidadesPaciente[0] as any).disponibilidade;

        if (primeiraDisponibilidade) {
          const primeiroDisponibilidadeId = primeiraDisponibilidade.id;
          //(`ID da primeira disponibilidade: ${primeiroDisponibilidadeId}`);

          if (primeiroDisponibilidadeId !== undefined) {
            this.disponibilidadeService.getDisponibilidade(primeiroDisponibilidadeId).subscribe((disponibilidadeDetalhes: Disponibilidade) => {
              this.horarioInicio = disponibilidadeDetalhes.horario_inicio; // Armazenando em variável
              this.horarioFim = disponibilidadeDetalhes.horario_fim;       // Armazenando em variável
              this.diaAtual = disponibilidadeDetalhes.dia_semana;          // Armazenando em variável
              this.idAtual = primeiroDisponibilidadeId;
              //alert(this.idAtual)

              this.pacienteForm.patchValue({
                disponibilidade: primeiroDisponibilidadeId,
                horario_inicio: this.horarioInicio,
                horario_fim: this.horarioFim
              });

              console.log('Detalhes da primeira disponibilidade:', disponibilidadeDetalhes);
              //alert(`ID da primeira disponibilidade: ${primeiroDisponibilidadeId}, Horário: ${this.horarioInicio} - ${this.horarioFim}`);
            }, (error) => {
              console.error('Erro ao carregar detalhes da disponibilidade:', error);
              this.snackBar.open('Erro ao carregar detalhes da disponibilidade.', 'Fechar', { duration: 3000 });
            });
          } else {
            alert('ID da primeira disponibilidade é indefinido.');
          }
        } else {
          alert('Nenhuma disponibilidade encontrada no primeiro item.');
        }
      } else {
        alert('Nenhuma disponibilidade encontrada.');
      }
    }, (error) => {
      console.error('Erro ao carregar disponibilidades:', error);
      this.snackBar.open('Erro ao carregar disponibilidades do paciente.', 'Fechar', { duration: 3000 });
    });
  }

  private loadPacienteData(id: number): void {
    if (id) {
      this.pacienteService.getPacienteById(id).subscribe((paciente) => {
        this.pacienteForm.patchValue(paciente);
      });
    }
  }

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      const disponibilidadeId = this.pacienteForm.value.disponibilidade; // Obtenha apenas o ID da disponibilidade
      if (this.isEditMode) {
        this.updatePaciente(disponibilidadeId); // Passa o ID da disponibilidade
      } else {
        this.createPaciente(disponibilidadeId); // Passa o ID da disponibilidade
      }
    }
  }


  private createPaciente(disponibilidadeId: number): void {
    const pacienteData = this.pacienteForm.value;

    // Buscar a disponibilidade completa pelo ID antes de criar a consulta
    this.disponibilidadeService.getDisponibilidade(disponibilidadeId).subscribe(
      (disponibilidade) => {
        // Após obter a disponibilidade, criar o paciente
        this.pacienteService.createPaciente(pacienteData).subscribe(
          (response) => {
            const pacienteId = response.id!;
            const pacienteUsername = pacienteData.username;

            // Criar as consultas após o paciente ser criado
            this.createConsulta(pacienteId, pacienteUsername, disponibilidade);

            // Atualizar a disponibilidade para não disponível
            this.updateDisponibilidade(disponibilidadeId, false);

            this.snackBar.open('Paciente cadastrado com sucesso!', 'Fechar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          (error) => {
            this.snackBar.open('Erro ao cadastrar paciente.', 'Fechar', { duration: 3000 });
          }
        );
      },
      (error) => {
        this.snackBar.open('Erro ao carregar disponibilidade.', 'Fechar', { duration: 3000 });
      }
    );
  }


  private createConsulta(pacienteId: number, pacienteUsername: string, disponibilidade: any): void {
    const pacienteData = this.pacienteForm.value;  // This contains the full patient data

    const consultas = [];

    const diasSemana: { [key: string]: number } = {
      'domingo': 0,
      'segunda': 1,
      'terça': 2,
      'quarta': 3,
      'quinta': 4,
      'sexta': 5,
      'sábado': 6
    };

    const diaSemana = diasSemana[disponibilidade.dia_semana.toLowerCase()];
    const hoje = new Date();
    let proximaData = new Date();
    proximaData.setDate(hoje.getDate() + ((6 + diaSemana - hoje.getDay()) % 7));
    proximaData.setHours(
      parseInt(disponibilidade.horario_inicio.split(':')[0]),
      parseInt(disponibilidade.horario_inicio.split(':')[1])
    );

    for (let i = 0; i < 4; i++) {
      const dataConsulta = new Date(proximaData);
      dataConsulta.setDate(proximaData.getDate() + (7 * i));

      const consultaData = {
        data: dataConsulta.toISOString(),
        disponibilidade: {
          id: disponibilidade.id,
          is_disponivel: false
        },
        paciente: {
          id: pacienteId,
          username: pacienteData.username,
          telefone: pacienteData.telefone,       // Add remaining properties
          email: pacienteData.email,
          cpf: pacienteData.cpf,
          dataDeNascimento: pacienteData.dataDeNascimento,
          quantidadeConsulta: pacienteData.quantidadeConsulta,
          password: pacienteData.password
        }
      };

      consultas.push(consultaData);
    }

    consultas.forEach(consulta => {
      this.consultaService.createConsulta(consulta).subscribe(
        () => {
          this.snackBar.open('Consulta criada com sucesso!', 'Fechar', { duration: 3000 });
        },
        (error) => {
          this.snackBar.open('Erro ao criar consulta.', 'Fechar', { duration: 3000 });
        }
      );
    });
  }

  private updatePaciente(disponibilidadeId: number): void {
    const pacienteData = this.pacienteForm.value;
    const pacienteId = this.data.paciente.id; // ID do paciente que está sendo editado

    // Atualiza o paciente
    this.pacienteService.updatePaciente(pacienteId, pacienteData).subscribe(
      () => {
        this.updateConsultas(pacienteId, disponibilidadeId); // Atualiza consultas após paciente
        this.snackBar.open('Paciente atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      (error) => {
        this.snackBar.open('Erro ao atualizar paciente.', 'Fechar', { duration: 3000 });
      }
    );
  }

  private updateConsultas(pacienteId: number, disponibilidadeId: number): void {
    this.consultaService.getConsultaByPacienteId(pacienteId).subscribe((consultas: Consulta[]) => {
      consultas.forEach(consulta => {

        // Atualiza a consulta para associar a nova disponibilidade
        consulta.disponibilidade.id = disponibilidadeId;

        // Atualiza a consulta no serviço
        this.consultaService.updateConsulta(consulta.id!, consulta).subscribe(
          () => {
            this.snackBar.open('Consulta atualizada com sucesso!', 'Fechar', { duration: 3000 });
          },
          (error) => {
            this.snackBar.open('Erro ao atualizar consulta.', 'Fechar', { duration: 3000 });
          }
        );
      });
    });
  }



  private updateDisponibilidade(disponibilidadeId: number, isAvailable: boolean): void {
    this.disponibilidadeService.getDisponibilidade(disponibilidadeId).subscribe((disponibilidade) => {
      const updatedDisponibilidade: Disponibilidade = {
        ...disponibilidade,
        is_disponivel: isAvailable
      };

      this.disponibilidadeService.updateDisponibilidade(disponibilidadeId, updatedDisponibilidade).subscribe(
        () => {
          this.snackBar.open('Disponibilidade atualizada com sucesso!', 'Fechar', { duration: 3000 });
        },
        (error) => {
          this.snackBar.open('Erro ao atualizar disponibilidade.', 'Fechar', { duration: 3000 });
        }
      );
    });
  }
}
