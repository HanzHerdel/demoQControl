import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormDinamicoComponent } from '../../formsDinamicos/form-dinamico/form-dinamico.component';
import { campoBase } from 'src/app/formsDinamicos/campo-base';
import { trigger, transition, style, animate } from '@angular/animations';
import { animacionPag,ComunService } from 'src/app/services/comun.service';
import { FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
  animations: [
    animacionPag(),
    trigger('animacionNgIf', [      
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('.5s ease-out', 
                style({ height: 32, opacity: 1 }))
      ]),
      transition(':leave',          [
        style({ height: 32, opacity: 1 }),
        animate('.5s ease-in', 
                style({ height: 0, opacity: 0 }))
        ]),
        ]
      ),
    ]
})
export class GastosPage implements OnInit {
camposGastos=[];
@ViewChild('formGastos')
private formGastosComponent: FormDinamicoComponent;
  constructor(private comun:ComunService, private data:DataService) { }

  ngOnInit() {
    for(let campo of environment.camposGastos){
      this.camposGastos.push(new campoBase(campo));
    }
  }
  datosGastoEmitidos(e){
    let gasto = e;
    gasto.fecha= this.data.getFechaFirestore();
    let form = this.formGastosComponent.form;
    this.creacionGenerica("gastos",form,gasto,"Gasto Agregado");
  }
    //creacion simple de datos
  creacionGenerica(nombreColeccion:string, form:FormGroup,data:{},mensajeExito:string){
    this.comun.darFormato(data);//formato de mayusculas y cambio de string a number 
    form.disable();
    this.data.crearDataGenerica(nombreColeccion,data).then(()=>
      {        
        form.reset();
        form.enable();
        this.comun.alerta("Éxito",mensajeExito);
      }).catch(err=> {console.log(err,"**");this.comun.alerta("Error","ha ocurrido un error inesperado")});
  }
}
