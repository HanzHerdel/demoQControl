import { Component, OnInit, ViewChild, HostBinding, Renderer2 } from '@angular/core';
import { FormDinamicoComponent } from '../../formsDinamicos/form-dinamico/form-dinamico.component';

import { campoBase } from '../../formsDinamicos/campo-base';
import { Subscription, pipe, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from './../../../environments/environment';
import { ComunService } from 'src/app/services/comun.service';
@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.page.html',
  styleUrls: ['./edicion.page.scss'],
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
    trigger('animacionItem', [      
      transition(':enter', [
        style({  opacity: 0 }),
        animate('.8s ease-out', 
                style({  opacity: 1 }))
      ]),
      transition(':leave',          [
        style({opacity: 1 }),
        animate('.3s ease-in', 
                style({ opacity: 0 }))
        ]),
        ]
      ),
      ]
})
export class EdicionPage implements OnInit {
  /********************* variables de forms ***********************/
  camposFormEditarItem:any;
  camposFormTipos:any;
  camposFormProveedor:any;
  camposFormMarcas:any;
  @ViewChild('formItem')
  private formItemComponent: FormDinamicoComponent;//necesario para limpiar los forms una vez los datos han sido guardados
  @ViewChild('formTipo')
  private formTipoComponent: FormDinamicoComponent;
  @ViewChild('formProveedor')
  private formProveedorComponent: FormDinamicoComponent;
  @ViewChild('formMarcas')
  private formMarcasComponent: FormDinamicoComponent;

  @HostBinding("class.--colNum")
  private columnasTabla:number;
  /*************************************/
    /************* variables del form editar items***************/
    categorias=[];
    proveedores=[];
    marcas=[];
    /****************variables del form editar marcas/proveedores/categorias ***********/
    marcasEditar=[];
    proveedoresEditar=[];
    categoriasEditar=[];
    	/////////////////declaracion de variables de busqueda
  tipoFiltro:string="";
  marcaFiltro:string="";
  proveedorFiltro:string="";
  busqueda:string="";
  busquedaCodigo:string="";
  articulos:any;
   /* variables handler lector de codigo de barras*/
  detenerEventoLector:any;
  leyendo:boolean=false;
  handler:any;
  codigo:string=""
  /************* fin variables del form de items***************/
    /************* subjet para destruir subscripcion al salir **************/
  desubsripcion = new Subject<void>();
/************************** Variables tabla **********************/
    //cabeceras de tabla con los keys de los campos a mostrar, modificar la cantidad de campos en scss 
  cabeceras = [
              {cabecera:'-',key:'existencias',necesario:true},
              {cabecera:'Nombre',key:'nombre',necesario:true}, 
              {cabecera:'Categoría',key:'tipo',necesario:true},             
              {cabecera:'Código',key:'codigo',necesario:true},            
              {cabecera:'Proveedor',key:'proveedor',necesario:false},
              {cabecera:'Marca',key:'marca',necesario:false}, 
              {cabecera:'Precio',key:'precio',necesario:true}

            ];
  //campos que necesitan capitalizacion para mostrar en tabla, no numericos
camposACapitalizar=['nombre','tipo','proveedor','marca'];
/************************** fin Variables tabla **********************/
/********variables de interfaz edicion item**********/
  rowSelected:any=null;
  itemSelected:any=null;
  cardSelected:any;
  tarjetaActiva:string="";
/*******fin variables de interfaz edicion item*********/
/*************************variables editar*************************/
marcaAEditar:any;
categoriaAEditar:any;
proveedorAEditar:any;
/*************************fin variables editar*************************/

 /***************VARIABLES DE FOOTER ULTIMOS EDITADOS *************************/
 ultimosEditados: HTMLElement;
 ultimosItemsModificados:any;
  constructor(private data:DataService, private renderer2:Renderer2,private comun: ComunService) {

   }

   ngOnInit() {
    this.suscripcionesDatos();  
    this.detenerEventoLector =  this.eventoLector();  
    this.ultimosEditados=document.getElementById("ultimosAgregados");
    setTimeout(()=>this.switch('editarItemCard'),800);
  }
  eventoLector(){
    return this.renderer2.listen('document', 'keypress', e =>{
      if (e['keyCode']===13){
        if(this.codigo.length>7){
          this.busquedaCodigo=this.codigo;                                
          this.searchCodigo();
          this.codigo="";
      }
        }else{
            this.codigo+=e['key'];
        }
        if(!this.leyendo){
            this.leyendo=true;
            setTimeout(()=>{
              this.codigo="";
              this.leyendo=false;
          }, 300);}	
    })
  }
   ngOnDestroy() {
    this.desubsripcion.next();
    this.desubsripcion.complete();
    this.detenerEventoLector();
    //document.removeEventListener('keypress',this.handler);
  }
  /****************** funciones de busqueda********************/
  suscripcionesDatos(){
      this.data.getTipoEditar().pipe(takeUntil(this.desubsripcion)).subscribe(changes=>{
      this.categorias=this.categoriasEditar=this.comun.extraerIdDatosSnapshot(changes);                
          //this.generarFormItems();
      })
  
   this.data.getUtimasModificaciones().pipe(takeUntil(this.desubsripcion)).subscribe(changes=>{
      this.ultimosItemsModificados=[];
        changes.forEach(articulo=> 
          {
            this.ultimosItemsModificados.push(articulo);
          })          
          //this.generarFormItems();
      })
    this.data.getProveedorEditar().pipe(takeUntil(this.desubsripcion)).subscribe(changes=>{
          this.proveedores=this.proveedoresEditar=this.comun.extraerIdDatosSnapshot(changes);
  
            //this.generarFormItems();
        })  
    this.data.getMarcasEditar().pipe(takeUntil(this.desubsripcion)).subscribe(changes=>{        
          this.marcas=this.marcasEditar=this.comun.extraerIdDatosSnapshot(changes);
            //this.generarFormItems();
          })
          
  }
  searchCodigo(){
    if(this.busquedaCodigo.length < 2)  return;
    this.busquedaCodigo =this.busquedaCodigo.toUpperCase();
    this.marcaFiltro,this.tipoFiltro = "";
   let sub= this.data.buscarPorCodigo(this.busquedaCodigo).subscribe( changes => {             
      if(changes.size>0){
            this.articulos=this.comun.extraerIdDatosGet(changes,this.camposACapitalizar);

        }else{
          this.comun.alerta("No Encontrado","el artículo no existe en la base de datos");
        }},()=>{},()=>{console.log("completado"); sub.unsubscribe()}
        );
  }
  
  search(){
    //if(this.busqueda && this.busqueda.length < 2)  return;
    this.busqueda =this.busqueda.toUpperCase();
    let sub= this.data.buscarItemsEditar(this.busqueda,this.marcaFiltro,this.tipoFiltro,this.proveedorFiltro,10)
      .subscribe( changes => {
               this.articulos=this.comun.extraerIdDatosGet(changes,this.camposACapitalizar);         
              },()=>{},
              ()=>{
                console.log("completado");
                sub.unsubscribe();},
              );
  }

  onCancel(e){
    console.log(e);
  }
/****************** funciones de busqueda********************/
/******************* Funciones interfaz******************/
//seleccionar filas en el cuadro de items
  selectItem(item,id, c:string=""){
    //si la variable c viene en la llamada de la funcion significa que viene del carrito y se seleccionara su debido item
    //seleccion de la fila a la cual pertenece el item si no hay uno seleccionado
      if (this.rowSelected ){
        if (this.rowSelected.id === "fila"+c+id){
          this.deSelectRow();
          this.itemSelected=null;

        }else{
          this.deSelectRow();
          this.selectRow(id,c);  
          this.itemSelected=null; 
          //time out para dar tiempo a limpiar los datos del item anterior
          setTimeout(function() {
            this.itemSelected=item;
            this.llenarCamposItem(item);	
          }.bind(this), 200);       
        }
      }else{
        this.selectRow(id,c);
          this.itemSelected=item;
          this.llenarCamposItem(item);	
      }
  }
  selectRow(id,c:string=""){
    //console.log(id);
    this.rowSelected = document.getElementById("fila"+id);
    this.rowSelected.classList.add("selected");
  }
  deSelectRow(){
    if (this.rowSelected ){
      this.rowSelected.classList.remove("selected");
      this.rowSelected=null;}
  }

/******************* FIn Funciones interfaz******************/
/******************** EDICION *********************/
edicionGenerica(nombreColeccion:string, form:FormGroup,data:{},id){
  const coleccion=nombreColeccion;
  this.comun.darFormato(data);
  form.disable();
  return this.data.editarDataGenerica(id,coleccion,data)
}
/******************** EDICION ITEM***********************/
  datosItemEmitidos(e){
    const data:any=e;
    const id=this.itemSelected.id;
    console.log("1",data);
    data.sobreLimite=!!(data.existencias<= data.limite);
    console.log(data);
    let form = this.formItemComponent.form;
    this.edicionGenerica("articulos",form,data,id).then(()=>
      {        
        form.reset();
        form.enable();
        this.itemSelected=null;
        this.deSelectRow();
        this.comun.alertaToast("Articulo editado");
        this.camposFormEditarItem=[];
        this.recargarBusqueda();
      }).catch(err=> {console.log(err,"**");this.comun.alerta("Error","ha ocurrido un error inesperado");form.enable();});
  }


  recargarBusqueda(){
    if (this.busquedaCodigo.length>0)
      this.searchCodigo();
    else this.search();
  }
  preguntarEliminarItem(){
    const id=this.itemSelected.id;
    const form = this.formItemComponent.form;
    this.comun.eliminarAlert(this.itemSelected.nombre,()=>{
      form.disable();
      this.data.eliminarItemGenerico(id,"articulos")      
        .then(()=> {
          this.comun.alerta("Eliminado","Se ha eliminado el articulo")
          form.reset();
          form.enable();
          this.recargarBusqueda();
          this.itemSelected=null;
          })
        .catch(err=> {form.enable();console.log(err,"**");this.comun.alerta("Error","ha ocurrido un error inesperado");})
    })
  }
  getArrayDatoDeArrayObjeto(arrayDeObjetos,nombreDato){
    let arrayDatos=[]
    for(let obj of arrayDeObjetos){
      arrayDatos.push(obj[nombreDato]);
    }
    return arrayDatos;
  }
  llenarCamposItem(item){
    /* por problemas de angular se debe tener una variable tipo OBJETO {} en el select para que se vuelva a renderizar al momento
    de cambiar sus valores, entonces estamos tomando los objetos para extraer un array con los nombres de las opciones*/
    let marcas=[],proveedores=[],categorias=[];
    for (let marca of this.marcas) marcas.push(marca.nombre);
    for (let proveedor of this.proveedores) proveedores.push(proveedor.nombre);
    for (let categoria of this.categorias) categorias.push(categoria.nombre);
    this.camposFormEditarItem=[];
    /*luego de esto buscamos los campos de tipo select, que en este caso son marca, proveedor y tipo, 
    para agregarles sus respectivos arrays */
    for(let campo of environment.camposItems){  
      let campoEditar=Object.assign({},campo);    
      if(campo.nombreCampo=="marca") campoEditar['opciones']=marcas;
      if(campo.nombreCampo=="proveedor") campoEditar['opciones']=proveedores;
      if(campo.nombreCampo=="tipo") campoEditar['opciones']=categorias;
      campoEditar['valor']=item[campo.nombreCampo];
      /*intentamos convertir a uppercase, se debe hacer try 
      porque de lo contrario al momento de meter un entero se detiene la aplicacion*/
      try{campoEditar['valor']= campoEditar['valor'].toUpperCase();}catch{}   
      this.camposFormEditarItem.push(new campoBase(campoEditar));
    }
  };
/*************** FIN EDICION ITEM ****************************/
/**********************EDICION MARCAS ************************/
  marcaAEditarSeleccionada(opcion){
    this.marcaAEditar=opcion;
    this.camposFormMarcas=[];
    for (let campo of environment.camposMarcas){
      let campoEditar=Object.assign({},campo);    
      campoEditar['valor']=this.marcaAEditar[campo.nombreCampo];
      if(campo.nombreCampo=='nombre') campoEditar['disabled']=true;
      this.camposFormMarcas.push(new campoBase(campoEditar));
    }
  }
  datosMarcaEmitidos(e){
      const data:any=e;
      const id = this.marcaAEditar.id;
      let form = this.formMarcasComponent.form;
      this.edicionGenerica("marca",form,data,id).then(()=>
          {        
            form.reset();
            form.enable();
            this.marcaAEditar=null;
            this.comun.alertaToast("Marca editada");
          }).catch(err=> 
            {console.log(err,"**");
            this.comun.alerta("Error","ha ocurrido un error inesperado");
            form.enable();});    
  }
  preguntarEliminarMarca(){
    const id=this.marcaAEditar.id;
    const form = this.formMarcasComponent.form;
    this.comun.eliminarAlert(this.marcaAEditar.nombre,()=>{
      this.data.eliminarItemGenerico(id,"marca")
        .then(()=> {
          this.comun.alerta("Eliminado","Se ha eliminado la marca")
          form.reset();
          form.enable();
          this.marcaAEditar=null;
          })
        .catch(err=> {form.enable();console.log(err,"**");this.comun.alerta("Error","ha ocurrido un error inesperado");})
    })
  }
  
  /********************** Fin EDICION MARCAS ************************/

  /**********************EDICION CATEGORIAS ************************/
categoriaAEditarSeleccionada(opcion){
  this.categoriaAEditar=opcion;
  this.camposFormTipos=[];
  for (let campo of environment.camposTipos){
    let campoEditar=Object.assign({},campo);     
    campoEditar['valor']=this.categoriaAEditar[campo.nombreCampo];
    if(campo.nombreCampo=='nombre') campoEditar['disabled']=true;
    this.camposFormTipos.push(new campoBase(campoEditar));
  }
}
datosCategoriaEmitidos(e){
    const data:any=e;
    const id = this.categoriaAEditar.id;
    let form = this.formTipoComponent.form;
    this.edicionGenerica("tipo",form,data,id).then(()=>
        {        
          form.reset();
          form.enable();
          this.categoriaAEditar=null;
          this.comun.alertaToast("Categoria editada");
        }).catch(err=> 
          {console.log(err,"**");
          this.comun.alerta("Error","ha ocurrido un error inesperado");
          form.enable();});    
}
preguntarEliminarCategoria(){
  const id=this.categoriaAEditar.id;
  const form = this.formTipoComponent.form;
  this.comun.eliminarAlert(this.categoriaAEditar.nombre,()=>{
    this.data.eliminarItemGenerico(id,"tipo")
      .then(()=> {
        this.comun.alerta("Eliminada","Se ha eliminado la categoria")
        form.reset();
        form.enable();
        this.categoriaAEditar=null;
        })
      .catch(err=> {form.enable();console.log(err,"**");this.comun.alerta("Error","ha ocurrido un error inesperado");})
  })
}

/********************** Fin EDICION CATEGORIAS ************************/
/**********************EDICION PROVEEDORES ************************/
proveedorAEditarSellecionado(opcion){
  this.proveedorAEditar=opcion;
  this.camposFormProveedor=[];
  for(let campo of environment.camposProveedor){    
    let campoEditar=Object.assign({},campo);   
    campoEditar['valor']=this.proveedorAEditar[campo.nombreCampo];
    if(campo.nombreCampo=='nombre') campoEditar['disabled']=true;
    this.camposFormProveedor.push(new campoBase(campoEditar));
  }
}
datosProveedorEmitidos(e){
    const data:any=e;
    const id = this.proveedorAEditar.id;
    let form = this.formProveedorComponent.form;
    this.edicionGenerica("proveedor",form,data,id).then(()=>
        {        
          form.reset();
          form.enable();
          this.proveedorAEditar=null;
          this.comun.alertaToast("Proveedor editado");
        }).catch(err=> 
          {console.log(err,"**");
          this.comun.alerta("Error","ha ocurrido un error inesperado");
          form.enable();});    
}
preguntarEliminarProveedor(){
  const id=this.proveedorAEditar.id;
  const form = this.formProveedorComponent.form;
  this.comun.eliminarAlert(this.proveedorAEditar.nombre,()=>{
    this.data.eliminarItemGenerico(id,"proveedor")
      .then(()=> {
        this.comun.alerta("Eliminado","Se ha eliminado al proveedor")
        form.reset();
        form.enable();
        this.proveedorAEditar=null;
        })
      .catch(err=> {form.enable();console.log(err,"**");this.comun.alerta("Error","ha ocurrido un error inesperado");})
  })
}

/********************** Fin EDICION CATEGORIAS ************************/
     /************ FUNCIONES DE INTERFAZ ************/
     /*******switch de ventanas cards**************/
  switch(e){
    if (this.cardSelected && !this.cardSelected.classList.contains('colapsado')){
      this.cardSelected.classList.add('colapsado');    }    
    this.cardSelected=document.getElementById(e);    
    setTimeout(()=>{this.tarjetaActiva=e;},400);    
    if (this.cardSelected.classList.contains('colapsado')){
      this.cardSelected.classList.remove('colapsado');
    }
    }  /*****************footer ultimos editados *************************/
  switchFooter(){
    if (!this.ultimosEditados.classList.contains("abierto"))
      this.ultimosEditados.classList.add( "abierto");
    else this.ultimosEditados.classList.remove( "abierto");
      // this.ultimosEditados.nativeElement.height = '80px'; 
  }
  
  /*************** fin funciones de interfaz ****************/
  /*************************** Alertas / loading**************************/



}
