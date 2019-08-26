import { AlertController } from '@ionic/angular';
import { DataService } from '../../services/data/data.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { campoBase } from '../../formsDinamicos/campo-base';
import { FormDinamicoComponent } from '../../formsDinamicos/form-dinamico/form-dinamico.component';
import {  Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ComunService } from 'src/app/services/comun.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-agregar',
  templateUrl: 'agregar.page.html',
  styleUrls: ['agregar.page.scss'],
  animations: [
    trigger('animacionPagina', [      
      transition(':enter', [
        style({  opacity: 0 }),
        animate('1s ease-out', 
                style({  opacity: 1 }))
      ]),
      transition(':leave',          [
        style({  opacity: 1 }),
        animate('1s ease-in', 
                style({ opacity: 0 }))
        ]),
        ]
      ),
    ]
})
export class AgregarPage implements OnInit {
  /********************* variables de forms ***********************/
  camposFormItem:any=[];
  camposFormTipos:any=[];
  camposFormProveedor:any=[];
  camposFormMarcas:any=[];
  @ViewChild('formItem')
  private formItemComponent: FormDinamicoComponent;//necesario para limpiar los forms una vez los datos han sido guardados
  @ViewChild('formTipo')
  private formTipoComponent: FormDinamicoComponent;
  @ViewChild('formProveedor')
  private formProveedorComponent: FormDinamicoComponent;
  @ViewChild('formMarcas')
  private formMarcasComponent: FormDinamicoComponent;
  /*************************************/
  /************* variables del form de items***************/
  categorias=[];
  proveedores=[];
  marcas=[];
  /************* subjet para destruir subscripcion al salir **************/
  desubsripcion = new Subject<void>();
  /*********************variables interfaz ******************/
  cardSelected:any;
  /*footer*/
  ultimosAgregados: HTMLElement;
  ultimosItemsAgregados:any[];
  cabeceras = [
        {cabecera:'-',key:'existencias',necesario:true},
        {cabecera:'Nombre',key:'nombre',necesario:true}, 
        {cabecera:'Categoría',key:'tipo',necesario:true},             
        {cabecera:'Código',key:'codigo',necesario:true},            
        {cabecera:'Proveedor',key:'proveedor',necesario:false},
        {cabecera:'Marca',key:'marca',necesario:false}, 
        {cabecera:'Precio',key:'precio',necesario:true}

      ];
  constructor(private data:DataService, private comun: ComunService) {
    /************* subscripciones de datos form item **************/
      this.data.getTipos().pipe(takeUntil(this.desubsripcion)).subscribe(changes=>{
      this.categorias=[]
        changes.forEach(categoria=> 
          {
            this.categorias.push(categoria['nombre']);
          })          
          this.generarFormItems();
      })
    this.data.getProveedores().pipe(takeUntil(this.desubsripcion)).subscribe(changes=>{
          this.proveedores=[];
          changes.forEach(proveedor=> 
            {
              this.proveedores.push(proveedor['nombre']);
            })        
            this.generarFormItems();
        })    
      
    this.data.getMarcas().pipe(takeUntil(this.desubsripcion)).subscribe(changes=>{
          this.marcas=[];
          changes.forEach(marca=>{
              this.marcas.push(marca['nombre']);
            })
            this.generarFormItems();
          })
        
    /************************************************/
  }
  ngOnInit() {   
    /*************** creacion de forms *****************/
    this.ultimosAgregados=document.getElementById("ultimosAgregados");
    this.generarFormItems();//este se genera desde una funcion para poder ser llamado mas adelante ya que depende de los valores de marcas y tipos
    
    for(let campo of environment.camposTipos){
      this.camposFormTipos.push(new campoBase(campo));
    }
    for(let campo of environment.camposProveedor){
      this.camposFormProveedor.push(new campoBase(campo));
    }
    for(let campo of environment.camposMarcas)
     { this.camposFormMarcas.push(new campoBase(campo))}
     this.data.getUtimosAgregados().pipe(takeUntil(this.desubsripcion)).subscribe(changes=>{
      this.ultimosItemsAgregados=[];
        changes.forEach(articulo=> 
          {
            this.ultimosItemsAgregados.push(articulo);
          })          
          //this.generarFormItems();
      }) 
    /***************** Fin creacion de forms ********************/
    setTimeout(()=>this.switch('agregarItemCard'),800);
  }
  ngOnDestroy() {
    this.desubsripcion.next();
    this.desubsripcion.complete();
  }
  generarFormItems(){
    this.camposFormItem= [];
    for(let campo of environment.camposItems){
      if(campo.nombreCampo=="marca") campo.opciones=this.marcas;
      if(campo.nombreCampo=="proveedor") campo.opciones=this.proveedores;
      if(campo.nombreCampo=="tipo") campo.opciones=this.categorias;
      this.camposFormItem.push(new campoBase(campo));
    }
  }
  /************ funciones de interfaz ************/
  switch(e){
    
    if (this.cardSelected && !this.cardSelected.classList.contains('colapsado')){
      this.cardSelected.classList.add('colapsado');
    }    
    this.cardSelected=document.getElementById(e);
    
    
    if (this.cardSelected.classList.contains('colapsado')){
      this.cardSelected.classList.remove('colapsado');
    }
    //if (this.cardSelected.classList.contains('colapsado')){
     // this.cardSelected.classList.remove('colapsado');
    //}else{
    //  this.cardSelected.classList.add('colapsado');
    //}
  }
   /************ fin funciones de interfaz ************/
    /************ funciones de creacion de datos ************/
  datosItemEmitidos(e){
    let data=e;
    let form = this.formItemComponent.form;
    console.log(data);
    let keywords = data["nombre"].toUpperCase().split(" ");
//console.log(arrayPalabras);
  for( var i = 0; i < keywords.length; i++){ 
    //console.log(arrayPalabras[i]);
    if ( keywords[i] === "" || keywords[i] === "DE" || keywords[i] === "LA" || 
      keywords[i] === "LAS" || keywords[i] === "DEL" || keywords[i] === "A" || keywords[i] === "QUE" ||
      keywords[i] === "CON" || keywords[i] === "POR" || keywords[i] === "EN") {
        keywords.splice(i, 1); 
      }
    };
    data['keywords']=keywords;
    let date= this.data.getFechaFirestore();
    data.fechaDeModificacion=data.agregado=date;
    data.ventasTotales=data.ganancias=0;
    data.sobreLimite=(data.existencias<= data.limite);
    this.creacionGenerica("articulos",form,data,"Artículo agregado");
  }
  datosProveedorEmitidos(e){
    let proveedor = e;
    let form = this.formProveedorComponent.form;
    this.creacionGenerica("proveedor",form,proveedor,"Proveedor Agregado");
  }
  datosMarcaEmitidos(e){
    let marca = e;
    let form = this.formMarcasComponent.form;
    this.creacionGenerica("marca",form,marca,"Marca Agregada");
  }
  datosTipoEmitidos(e){
    let tipo = e;
    let form = this.formTipoComponent.form;
    this.creacionGenerica("tipo",form,tipo,"Categoria Agregada");
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
  /*switchFooter*/
  switchFooter(){
    if (!this.ultimosAgregados.classList.contains("abierto"))
      this.ultimosAgregados.classList.add( "abierto");
    else this.ultimosAgregados.classList.remove( "abierto");
      // this.ultimosEditados.nativeElement.height = '80px'; 
  }
    /************ fin  funciones de creacion de datos ************/

}
