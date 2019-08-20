import { CamposService } from './../campos.service';
import { Component , Input} from '@angular/core';
import { FormGroup }        from '@angular/forms';
import { campoBase } from '../campo-base';

@Component({
  selector: 'app-campo-dinamico',
  templateUrl: './campo-dinamico.component.html',
  styleUrls: ['./campo-dinamico.component.scss'],
})
export class CampoDinamicoComponent {
  @Input() campo: campoBase<any>;
  @Input() form: FormGroup;
  errorLabel:string;
  get formInvalido() { 
    let campoForm=this.form.controls[this.campo.nombreCampo];   
    let invalido:boolean=campoForm.invalid && campoForm.touched;
      if(invalido){
         // console.log(this.campo.nombreCampo,"**", campoForm.errors);
        if(campoForm.hasError('required')){
          this.errorLabel = this.campo.etiquetaErrRequerido;
        }
        if(campoForm.hasError('minlength')){
          this.errorLabel = 'El campo debe contener ' +this.campo.minCaracteres + ' caractéres'
        }
        if(campoForm.hasError('pattern')){
          this.errorLabel = this.campo.etiquetaErrPatron;
        }
    return invalido; 
    }
    }
    


}
