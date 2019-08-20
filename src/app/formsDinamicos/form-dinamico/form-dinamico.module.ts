import { CampoDinamicoComponent } from './../campo-dinamico/campo-dinamico.component';
import { FormDinamicoComponent } from './form-dinamico.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule }          from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  //schemas: [    CUSTOM_ELEMENTS_SCHEMA  ],
  exports: [ FormDinamicoComponent, CampoDinamicoComponent ],
  declarations: [FormDinamicoComponent, CampoDinamicoComponent]
})
export class FormDinamicoModule {}
