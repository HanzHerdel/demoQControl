import { CamposService } from './../campos.service';
import { Component, OnInit, Input, Output,} from '@angular/core';
import { FormGroup, FormControl, Validators }                 from '@angular/forms';
import { campoBase } from '../campo-base';
import { EventEmitter } from "@angular/core";
@Component({
  selector: 'app-form-dinamico',
  templateUrl: './form-dinamico.component.html',
  styleUrls: ['./form-dinamico.component.scss'],
})
export class FormDinamicoComponent implements OnInit {
  @Input() campos: campoBase<any>[]=[];
  @Input() botonLabel:string="Agregar";
  submited:boolean=false;
  form: FormGroup;
  data="";
  //trigger para enviar un evento con los datos
  //se enlaza a una funcion al momento de agregar el template
  @Output() emitirDatos=new EventEmitter();
  constructor(private campoServicio:CamposService ) { }

  ngOnInit() {
   // this.form = this.campoServicio.toFormGroup(this.campos)
    let group: any = {};
    // creacion del form campo por campo dandole valores a sus inputs (si se tienen) y validaciones si es requerido
   this.campos.forEach(campo => {
      let validaciones= campo.requerido?[Validators.required]:null;
      if(campo.patronRequerido) validaciones=[Validators.required,Validators.pattern(campo.patronRequeridoString)];
      group[campo.nombreCampo] = new FormControl(campo.valor || '',validaciones ) 
    });
      //[Validators.required , Validators.pattern("[A-Za-z0-9]")]
  this.form = new FormGroup(group);
}
  onSubmit(){
    this.marcarCamposComoTocados();
    if(this.form.valid){
    this.emitirDatos.emit(this.form.value);
    }
  }
  marcarCamposComoTocados(){
    for(let i in this.form.controls){
      this.form.controls[i].setValue(this.form.controls[i].value);
      this.form.controls[i].markAsTouched();
    }
  }
}
