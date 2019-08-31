import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfiguracionPage } from './configuracion.page';
import { FormDinamicoModule } from 'src/app/formsDinamicos/form-dinamico/form-dinamico.module';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,    
    FormDinamicoModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfiguracionPage]
})
export class ConfiguracionPageModule {}
