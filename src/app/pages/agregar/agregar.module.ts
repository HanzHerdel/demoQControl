import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AgregarPage } from './agregar.page';
import { FormDinamicoModule } from '../../formsDinamicos/form-dinamico/form-dinamico.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,    
    FormDinamicoModule,
    RouterModule.forChild([
      {
        path: '',
        component: AgregarPage
      }
    ])
  ],
  declarations: [AgregarPage]
})
export class AgregarPageModule {}
