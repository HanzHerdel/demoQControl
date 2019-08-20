import { campoBase } from './campo-base';
import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CamposService {

  constructor() { }
  toFormGroup(campos: campoBase<any>[] ) {
    let group: any = {};
    campos.forEach(campo => {
      group[campo.nombreCampo] = campo.requerido ? new FormControl(campo.valor || '', Validators.required)
                                              : new FormControl(campo.valor || '');
    });
    return new FormGroup(group);
  }
}
