import { environment } from './../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormDinamicoComponent } from '../../formsDinamicos/form-dinamico/form-dinamico.component';
import { campoBase } from 'src/app/formsDinamicos/campo-base';
import { animacionPag } from 'src/app/services/comun.service';
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  animations:[
    animacionPag(),
  ]
})
export class ConfiguracionPage implements OnInit {
  usuarios=[
    {usuario:'DonJose',
    nombre:'Jose Contreras',
    tel:'55525255',
    tipo:'Administrador',
  },
  {usuario:'pedro',
  nombre:'Pedro Al',
  tel:'55725265',
  tipo:'Cajero',
  },
  {usuario:'josue',
  nombre:'Josue Mendez',
  tel:'53528255',
  tipo:'Vendedor',
  }
  ]
  camposUsuario:any[]=[];
  @ViewChild('formTipo')
  private formTipoComponent: FormDinamicoComponent;
  constructor() { }

  ngOnInit() {
    for(let campo of environment.camposUsuario){
      this.camposUsuario.push(new campoBase(campo));
    }
    
  }
  datosItemEmitidos(e){

  }
}
