import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PacienteService } from '../services/paciente.service';
import { DisponibilidadeService } from '../services/disponibilidade.service';
import { ConsultaService } from '../services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./paciente-form.component.scss'],
})
export class PacienteFormComponent implements OnInit {
  pacienteForm: FormGroup;
  disponibilidades: any[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private disponibilidadeService: DisponibilidadeService,
    private consultaService: ConsultaService,
    public dialogRef: MatDialogRef<PacienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.pacienteForm = this.fb.group({
      username: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      dataDeNascimento: ['', Validators.required],
      password: ['', Validators.required],
      disponibilidade: ['', Validators.required], // Campo para vincular a disponibilidade
    });
  }

  ngOnInit(): void {
    this.loadDisponibilidades();

    if (this.data && this.data.paciente) {
      this.isEditMode = true;
      this.pacienteForm.patchValue(this.data.paciente);
      this.pacienteForm.get('disponibilidade')?.setValue(this.data.paciente.disponibilidade_id); // Definindo o ID da disponibilidade
    }
  }

  loadDisponibilidades() {
    this.disponibilidadeService.getDisponibilidades().subscribe((data) => {
      this.disponibilidades = data;
    });
  }

  onSubmit() {
    if (this.pacienteForm.invalid) {
      console.warn('Formulário inválido', this.pacienteForm.errors);
      return;
    }

    const pacienteData = {
      ...this.pacienteForm.value,
      disponibilidade_id: this.pacienteForm.value.disponibilidade // Adicionando o ID da nova disponibilidade
    };

    console.log('Dados do paciente antes do POST/PUT:', pacienteData);

    const saveOperation = this.isEditMode
      ? this.pacienteService.updatePaciente(this.data.paciente.id, pacienteData)
      : this.pacienteService.createPaciente(pacienteData);

    saveOperation.subscribe({
      next: (paciente) => {
        console.log(this.isEditMode ? 'Paciente atualizado com sucesso' : 'Paciente criado:', paciente);

        if (this.isEditMode) {
          // Se estamos editando, desvinculamos a disponibilidade antiga
          this.desassociarDisponibilidade(this.data.paciente.id, this.data.paciente.disponibilidade_id, pacienteData.disponibilidade_id);
        } else {
          // Caso de criação, vincula a nova disponibilidade diretamente
          console.log(pacienteData)
          this.vincularPacienteADisponibilidade(paciente.id, pacienteData.disponibilidade_id);
        }

        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(this.isEditMode ? 'Erro ao atualizar paciente:' : 'Erro ao criar paciente:', err);
        this.openSnackBar('Erro: ' + (err.error?.message || err.message));
      }
    });
  }

  desassociarDisponibilidade(pacienteId: number, disponibilidadeIdAtual: number, novaDisponibilidadeId: number) {
    // Atualiza a disponibilidade atual para marcar que não está mais em uso
    this.disponibilidadeService.atualizarDisponibilidade(disponibilidadeIdAtual, { emUso: false, paciente: null }).subscribe({
      next: () => {
        console.log('Disponibilidade atualizada para não estar em uso.');

        // Vincula o paciente à nova disponibilidade
        this.vincularPacienteADisponibilidade(pacienteId, novaDisponibilidadeId);
      },
      error: (err) => {
        console.error('Erro ao desassociar disponibilidade do paciente:', err);
      }
    });
  }

  vincularPacienteADisponibilidade(pacienteId: number, disponibilidadeId: number) {
    // Atualiza a disponibilidade para marcar que está em uso
    this.disponibilidadeService.atualizarDisponibilidade(disponibilidadeId, { emUso: true, paciente: pacienteId }).subscribe({
      next: () => {
        console.log('Disponibilidade atualizada para estar em uso.');
        
        // Vincula o paciente à nova disponibilidade
        this.disponibilidadeService.updateDisponibilidade(pacienteId, disponibilidadeId).subscribe({
          next: () => {
            console.log('Paciente vinculado à nova disponibilidade com sucesso!');
            this.createConsultas(pacienteId, disponibilidadeId);
          },
          error: (err) => {
            console.error('Erro ao vincular paciente à nova disponibilidade:', err);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao atualizar disponibilidade:', err);
      }
    });
  }

  createConsultas(pacienteId: number, disponibilidadeId: number) {
    const disponibilidade = this.disponibilidades.find(d => d.id === disponibilidadeId);

    if (disponibilidade) {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const targetDay = this.getDayOfWeekIndex(disponibilidade.dia_semana);

      let firstConsultaDate = new Date(currentDate);
      firstConsultaDate.setDate(currentDate.getDate() + ((targetDay - currentDay + 7) % 7));

      for (let i = 0; i < 10; i++) {
        const consultaDate = new Date(firstConsultaDate);
        consultaDate.setDate(firstConsultaDate.getDate() + i * 7);

        this.consultaService.createConsulta({
          data: consultaDate.toISOString().split('T')[0],
          inicio: disponibilidade.horario_inicio,
          fim: disponibilidade.horario_fim,
          paciente: pacienteId,
        }).subscribe({
          next: () => console.log('Consulta criada com sucesso.'),
          error: (err) => console.error('Erro ao criar consulta:', err)
        });
      }
    }
  }

  getDayOfWeekIndex(diaSemana: string): number {
    const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return diasSemana.indexOf(diaSemana.toLowerCase());
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
    });
  }

  deletePaciente() {
    const pacienteId = this.data.paciente.id; // ID do paciente a ser deletado
    const disponibilidadeId = this.data.paciente.disponibilidade_id; // ID da disponibilidade associada

    this.pacienteService.deletePaciente(pacienteId).subscribe({
      next: () => {
        console.log('Paciente deletado com sucesso.');

        // Reativa a disponibilidade
        this.disponibilidadeService.atualizarDisponibilidade(disponibilidadeId, { emUso: false, paciente: null }).subscribe({
          next: () => {
            console.log('Disponibilidade reativada com sucesso.');
            this.dialogRef.close(true); // Fecha o diálogo
            this.openSnackBar('Paciente deletado e disponibilidade reativada.');
          },
          error: (err) => {
            console.error('Erro ao reativar disponibilidade:', err);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao deletar paciente:', err);
        this.openSnackBar('Erro ao deletar paciente: ' + (err.error?.message || err.message));
      }
    });
  }
}
