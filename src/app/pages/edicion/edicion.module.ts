import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EdicionPage } from './edicion.page';

import { FormDinamicoModule } from '../../formsDinamicos/form-dinamico/form-dinamico.module';

const routes: Routes = [
  {
    path: '',
    component: EdicionPage
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
  declarations: [EdicionPage]
})
export class EdicionPageModule {}
