import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PacienteService } from '../services/paciente.service'; // Serviço para fazer chamadas de API
import { DisponibilidadeService } from '../services/disponibilidade.service'; // Serviço para obter disponibilidades

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  standalone: true,
  imports:[ReactiveFormsModule]
})
export class PacienteFormComponent implements OnInit {
  pacienteForm: FormGroup;
  disponibilidades: any[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private disponibilidadeService: DisponibilidadeService,
    public dialogRef: MatDialogRef<PacienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pacienteForm = this.fb.group({
      username: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      dataDeNascimento: ['', Validators.required],
      disponibilidade: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDisponibilidades();

    // Verifica se está em modo de edição
    if (this.data && this.data.paciente) {
      this.isEditMode = true;
      this.pacienteForm.patchValue(this.data.paciente);
    }
  }

  loadDisponibilidades() {
    this.disponibilidadeService.getDisponibilidades().subscribe((data) => {
      this.disponibilidades = data;
    });
  }

  onSubmit() {
    if (this.pacienteForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.pacienteService.updatePaciente(this.data.paciente.id, this.pacienteForm.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.pacienteService.createPaciente(this.pacienteForm.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
