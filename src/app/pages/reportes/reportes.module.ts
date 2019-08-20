import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportesPage } from './reportes.page';

import { MyDatePickerModule } from 'mydatepicker';


import { File } from '@ionic-native/file/ngx';
import { FileOpener } from  '@ionic-native/file-opener/ngx';

const routes: Routes = [
  {
    path: '',
    component: ReportesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDatePickerModule,
    RouterModule.forChild(routes),
    
    
  ],
  providers:[    
    FileOpener,
    File
  ],
  declarations: [ReportesPage,]
})
export class ReportesPageModule {}
