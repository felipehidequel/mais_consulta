import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PacienteService } from '../services/paciente.service';
import { DisponibilidadeService } from '../services/disponibilidade.service';
import { ConsultaService } from '../services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Consulta } from '../class/Consulta';
import { Disponibilidade } from '../class/Disponibilidade';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./paciente-form.component.scss'],
})
export class PacienteFormComponent implements OnInit {
  pacienteForm!: FormGroup;
  disponibilidades: any[] = [];
  isEditMode = false;

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
    this.loadDisponibilidades();
    if (this.isEditMode) {
      this.loadPacienteData(this.data.paciente.id); // Passa a ID do paciente
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
      disponibilidade: ['', Validators.required]
    });
  }

  private loadDisponibilidades(): void {
    this.disponibilidadeService.getDisponibilidades().subscribe((data) => {
      this.disponibilidades = data;
    });
  }

  private loadPacienteData(id: number): void {
    if (id) {
      this.pacienteService.getPaciente(id).subscribe((paciente) => {
        this.pacienteForm.patchValue(paciente);
        // Se houver uma disponibilidade associada, você pode setar no formulário
        if (paciente.disponibilidade) {
          this.pacienteForm.controls['disponibilidade'].setValue(paciente.disponibilidade.id);
        }
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
  
            // Criar as consultas após o paciente ser criado e disponibilidade carregada
            this.createConsulta(pacienteId, pacienteUsername, disponibilidadeId, disponibilidade);
  
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
  
  private updatePaciente(disponibilidadeId: number): void {
    const pacienteData = this.pacienteForm.value;
    const pacienteId = this.data.paciente.id; // ID do paciente que está sendo editado

    // Primeiro, atualiza o paciente
    this.pacienteService.updatePaciente(pacienteId, pacienteData).subscribe(
      () => {
        this.updateConsulta(pacienteId, disponibilidadeId);
        this.updateDisponibilidade(disponibilidadeId, false); // Marcar a nova disponibilidade como não disponível
        this.snackBar.open('Paciente atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      (error) => {
        this.snackBar.open('Erro ao atualizar paciente.', 'Fechar', { duration: 3000 });
      }
    );
  }

  private createConsulta(pacienteId: number, pacienteUsername: string, disponibilidadeId: number, disponibilidade: any): void {
    const pacienteData = this.pacienteForm.value;
    const consultas = [];
  
    // Define a data inicial para a consulta com base no dia da semana e horário de início
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
    proximaData.setHours(parseInt(disponibilidade.horario_inicio.split(':')[0]), parseInt(disponibilidade.horario_inicio.split(':')[1]));
  
    // Criar 4 consultas, uma a cada semana no mesmo dia e horário
    for (let i = 0; i < 4; i++) {
      const dataConsulta = new Date(proximaData);
      dataConsulta.setDate(proximaData.getDate() + (7 * i));
  
      const consultaData = {
        data: dataConsulta.toISOString(),
        disponibilidade: {
          id: disponibilidadeId,
          is_disponivel: false
        },
        paciente: {
          id: pacienteData.id,
          username: pacienteData.username,
          telefone: pacienteData.telefone,
          email: pacienteData.email,
          cpf: pacienteData.cpf,
          dataDeNascimento: pacienteData.dataDeNascimento,
          password: pacienteData.password
        }
      };
  
      consultas.push(consultaData);
    }
  
    // Iterar e criar cada consulta
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
  


  private updateConsulta(pacienteId: number, disponibilidadeId: number): void {
    this.consultaService.getConsultaByPacienteId(pacienteId).subscribe((consultas: Consulta[]) => {
      if (consultas.length > 0) {
        const consulta = consultas[0]; // Pegue a primeira consulta se houver mais de uma
        consulta.disponibilidade = disponibilidadeId; // Atualiza a disponibilidade na consulta
        this.consultaService.updateConsulta(consulta.id!, consulta).subscribe(
          () => {
            this.snackBar.open('Consulta atualizada com sucesso!', 'Fechar', { duration: 3000 });
          },
          (error) => {
            this.snackBar.open('Erro ao atualizar consulta.', 'Fechar', { duration: 3000 });
          }
        );
      }
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
