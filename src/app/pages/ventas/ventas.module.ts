import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { VentasPage } from './ventas.page';
import { FormDinamicoModule } from '../../formsDinamicos/form-dinamico/form-dinamico.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FormDinamicoModule,
    RouterModule.forChild([
      {
        path: '',
        component: VentasPage
      }
    ])
  ],
  declarations: [VentasPage]
})
export class VentasPageModule {}
