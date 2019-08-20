import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { IonicModule } from '@ionic/angular';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { GraficasPage } from './graficas.page';

const routes: Routes = [
  {
    path: '',
    component: GraficasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDatePickerModule,
    Ng2GoogleChartsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GraficasPage]
})
export class GraficasPageModule {}
