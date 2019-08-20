import { ComunService } from './../../services/comun.service';
import { Component, ViewChild, Renderer2 } from '@angular/core';
import { FormDinamicoComponent } from 'src/app/formsDinamicos/form-dinamico/form-dinamico.component';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription, Subject } from 'rxjs';
import { animate, style, transition, trigger,state } from '@angular/animations';
import { campoBase } from 'src/app/formsDinamicos/campo-base';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

/* cambiar el loging en produccion */
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-ventas',
  templateUrl: 'ventas.page.html',
  styleUrls: ['ventas.page.scss'],
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
    trigger('animacionNgIf', [      
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('.5s ease-out', 
                style({ height: 32, opacity: 1 }))
      ]),
      transition(':leave',          [
        style({ height: 32, opacity: 1 }),
        animate('.5s ease-in', 
                style({ height: 0, opacity: 0 }))
        ]),
        ]
      ),
      trigger('animacionTablaItems', [      
        transition(':enter', [
          style({ 'max-height': 0, opacity: 0 }),
          animate('.5s ease-out', 
                  style({ 'max-height': '25vh', opacity: 1 }))
        ]),
        transition(':leave',          [
          style({ 'max-height': '25vh', opacity: 1 }),
          animate('.5s ease-in', 
                  style({ 'max-height': 0, opacity: 0 }))
          ]),
      
        ]
      ),
      trigger('animacionModal', [      
        transition(':enter', [
          style({  opacity: 0 }),
          animate('.9s ease-out', 
                  style({  opacity: 1 }))
        ]),
        transition(':leave',          [
          style({  opacity: 1 }),
          animate('.8s ease-in', 
                  style({  opacity: 0 }))
        ]),
      ]),
      trigger('footerAbierto',[
        state('true', style({ height: '50vh' })),
        state('false', style({ height: '30px' })),
        transition('false <=> true', animate(300))
      ]),      
        trigger('etiquetaFooter',[
        state('true', style({ height: '0px','margin-top': '0px',opacity: '0','padding-top': '0'})),
        state('false', style({ height: '35px' , 'padding-top': '7px'})),
        transition('false <=> true', animate(200))
    ]),
    ],
  })


export class VentasPage {

    /////////////////declaracion de variables de busqueda
  tipoFiltro:string="";
  marcaFiltro:string="";
  proveedorFiltro:string="";
  busqueda:string="";
  busquedaCodigo:string="";
  articulos=[];
  categorias=[];
  proveedores=[];
  marcas=[];
  desubsripcionArticulos = new Subject<void>();
  /* variables handler lector de codigo de barras*/
  detenerEventoLector:any;
  leyendo:boolean=false;
  handler:any;
  codigo:string="";
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
  cabecerasCarrito=[
    {cabecera:'-',key:'cantidad',necesario:true},
    {cabecera:'Nombre',key:'nombre',necesario:true}, 
    {cabecera:'Categoría',key:'tipo',necesario:true},             
    {cabecera:'Código',key:'codigo',necesario:true},            
    {cabecera:'Proveedor',key:'proveedor',necesario:false},
    {cabecera:'Marca',key:'marca',necesario:false}, 
    {cabecera:'Precio',key:'precio',necesario:true},
    {cabecera:'Total',key:'total',necesario:true}
  ];
  //campos que necesitan capitalizacion para mostrar en tabla, no numericos
  camposACapitalizar=['nombre','tipo','proveedor','marca'];
/********variables de interfaz tabla**********/
  rowSelected:any=null;
  itemSelected:any=null;
  itemSelectedCarrito:any=null;
  /*************VENTAS************/
  shopList=[];  
  unidadesAlCarrito=1;  /************* array subscripciones para destruir al salir **************/  
  /************* subjet para destruir subscripcion al salir **************/
  desubsDatosEstaticos = new Subject<void>();
  //desubscripcionCliente = new Subject<void>();
  /************* FOOTER CLIENTE **************/
  clienteFooter: HTMLElement;
  footerAbierto:boolean=false; //animacion footer
  clienteSeleccionado:any;
  leyendaSeleccionarCliente:string="Seleccionar Cliente";
  etiquetaCliente=this.leyendaSeleccionarCliente;
    /***********CREACION DE CLIENTES */
  @ViewChild('formCliente')
  private formClienteComponent: FormDinamicoComponent;
  camposFormCliente=[];
  modalCliente:HTMLElement;
  mostrarModal:boolean=false;
  clientes=[];
  busquedaCliente:string;
  busquedaNit:string;
  /********************FIN CREACION DE CLIENTES************/
  constructor(private data:DataService, private renderer2:Renderer2, private comun: ComunService,
    private firebaseAuth: AngularFireAuth
    ) {    
  }
	login(email: string="contacto@quetzaltech.net", password: string="123456"){
    return this.firebaseAuth
      .auth.signInWithEmailAndPassword(email, password).then(value => {
        console.log(value,'Logueado!!!');

      })  ;
  	}

  ngOnInit() {
    /*************************/
    this.login();
    this.suscripcionesDatos();  
    this.detenerEventoLector =  this.eventoLector();  
    this.clienteFooter=document.getElementById("clienteCard");
    this.modalCliente=document.getElementById("modalCliente")
    for(let campo of environment.camposCliente){
      this.camposFormCliente.push(new campoBase(campo));
    }
  }
  ngOnDestroy() {
    this.desubsDatosEstaticos.next();
    this.desubsDatosEstaticos.complete();   
    this.desubsripcionArticulos.next();
    this.desubsripcionArticulos.complete();
  }
  suscripcionesDatos(){
    this.data.getTipoEditar().pipe(takeUntil(this.desubsDatosEstaticos)).subscribe(changes=>{
    this.categorias=[];
    changes.forEach(categoria=> 
      {
        const data =  categoria.payload.doc.data() as any;
        const id = categoria.payload.doc.id;
        const datos = { id,  ...data };
        this.categorias.push(data);
      })          
      //this.generarFormItems();
      })
    this.data.getProveedorEditar().pipe(takeUntil(this.desubsDatosEstaticos)).subscribe(changes=>{
      this.proveedores=[];
      changes.forEach(proveedor=> 
        {
          const data =  proveedor.payload.doc.data() as any;
          const id = proveedor.payload.doc.id;
          const datos = { id,  ...data };
          this.proveedores.push(data);
        })        
        //this.generarFormItems();
    })    
  
    this.data.getMarcasEditar().pipe(takeUntil(this.desubsDatosEstaticos)).subscribe(changes=>{        
      this.marcas=[];
      changes.forEach(marca=>{
        const data =  marca.payload.doc.data() as any;
        const id = marca.payload.doc.id;
        const datos = { id,  ...data };
        this.marcas.push(data);
      })
      })  
    this.buscarCliente()  ;
  
    }
/** BUSQUEDA DE ARTICULOS*/
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
          }, 200);}	
    })
  }
  searchCodigo(){
    if(this.busquedaCodigo && this.busquedaCodigo.length>2){
      if(this.busquedaCodigo.length>1){
      this.busquedaCodigo =this.busquedaCodigo.toUpperCase();
      this.marcaFiltro,this.tipoFiltro,this.busqueda,this.proveedorFiltro = "";
      this.desubsripcionArticulos.next();
      this.data.buscarPorCodigo(this.busquedaCodigo).pipe(takeUntil(this.desubsripcionArticulos)).subscribe( changes => {             
        if(changes.size>0){
          this.articulos=this.comun.extraerIdDatosGet(changes,this.camposACapitalizar);
          }else{
            this.comun.alerta("No Encontrado","el artículo no existe en la base de datos");
          }
        });
      }
    }
  }
  search(){
    if(this.busqueda && this.busqueda.length>2){
    this.busqueda =this.busqueda.toUpperCase();
    this.desubsripcionArticulos.next();
    this.data.buscarItemsFullFiltros(this.busqueda,this.marcaFiltro,this.tipoFiltro,this.proveedorFiltro,10).pipe(takeUntil(this.desubsripcionArticulos))
      .subscribe( changes => {
        this.articulos=[];
            changes.map(a => {
              const data = a.payload.doc.data() as any;                  
              //capitalizar campos requeridos para un mejor despliegue
              this.camposACapitalizar.map(key=>data[key]=this.comun.capitalizar(data[key]))
              const id = a.payload.doc.id;
              let resEd = { id,  ...data };
              this.articulos.push(resEd);
              });
          })
        }
  }
  onCancel(e){
    console.log(e);
  }
  /** FIN BUSQUEDA DE ARTICULOS*/
  /******************* Funciones interfaz******************/
//seleccionar filas en el cuadro de items
selectItem(item,nombre,index,clase='selected'){
  //si la variable c viene en la llamada de la funcion significa que viene del carrito y se seleccionara su debido item
  //seleccion de la fila a la cual pertenece el item si no hay uno seleccionado
    if(this.itemSelectedCarrito){
      this.deSelectRow("selectedCarrito");
      this.itemSelectedCarrito=null;
      }
      this.unidadesAlCarrito=1;
    const id=nombre+index;
    if (this.rowSelected ){
      if (this.rowSelected.id === id){
        this.deSelectRow(clase);
        this.itemSelected=null;        
      }else{
        this.deSelectRow(clase);
        this.selectRow(id,clase);  
        this.itemSelected=item;    
      }
    }else{
      this.selectRow(id,clase);
        this.itemSelected=item;
       // this.llenarCamposItem(item);	
    }
}
selectItemCarrito(item,nombre,index,clase){
//el item trae la informacion del id, el nombre el nombre del row index
  if(this.itemSelected){
    this.itemSelected=null;
    this.deSelectRow('selected');
  }
  console.log(nombre,index,"**");
    const id=nombre+index;
    if (this.rowSelected ){
      if (this.rowSelected.id === id){
        this.deSelectRow(clase);
        this.itemSelectedCarrito=null;

      }else{
        this.deSelectRow(clase);
        this.selectRow(id,clase);  
        this.itemSelectedCarrito=item;    
      }
    }else{
      this.selectRow(id,clase);
        this.itemSelectedCarrito=item;
       // this.llenarCamposItem(item);	
    }
}
selectRow(id,clase){
  //console.log(id);
  this.rowSelected = document.getElementById(id);
  this.rowSelected.classList.add(clase);
}
deSelectRow(clase){
  if (this.rowSelected ){
    this.rowSelected.classList.remove(clase);
    this.rowSelected=null;}
}

/******************* FIn Funciones interfaz******************/ 
/***********AGREGAR/QUITAR ARTICULOS***********/
  agregarAlCarrito(itemAgregar=this.itemSelected){
    let index = this.existeEnCarrito(itemAgregar);
    //si encuentra el objeto le agregara uno a su cantidad
    if(this.unidadesAlCarrito>0){
      if (index >-1){
          //console.log(this.shopList[index].cantidad, "cantidad")
          if (this.validarExistencias(itemAgregar,this.unidadesAlCarrito+this.shopList[index].cantidad))
            {this.shopList[index].cantidad +=this.unidadesAlCarrito;
            this.shopList[index].total=this.shopList[index].cantidad*this.shopList[index].precio;}
          else return
      }else {
      //////// si no encuentra el item lo agregara a la lista mediante una copia + la cantidad
          const cantidad=this.unidadesAlCarrito;
          const total = cantidad * itemAgregar.precio;
        if(this.validarExistencias(itemAgregar,cantidad)){
            let item = {cantidad, ...itemAgregar, total};
            console.log(item)
            this.shopList.push(item);
            console.log(this.shopList);
          }
        }
      this.unidadesAlCarrito=1;
    }
  }

  existeEnCarrito(itemAgregar){
    for(let i=0;i<this.shopList.length; i++){
      if(this.shopList[i]['id']===itemAgregar['id'])
        return i;
    }
    return -1;
  }
  //verificar disponibilidad de item

  validarExistencias(item,cantidad){
        if(cantidad>item.existencias){
          this.comun.alerta("Sin Existencias","Productos insuficientes para agregar al carrito");
          return false;
        }return true;
  }
  //restar cantidad o eliminar item
  eliminarDelCarrito(){
    let index = this.existeEnCarrito(this.itemSelectedCarrito);
    if (this.shopList[index].cantidad>1){
        this.shopList[index].cantidad -=1;
        this.shopList[index].total=this.shopList[index].cantidad*this.shopList[index].precio;
    }
      else{
      ////si no existen mas unidades se elimina de la lista  
        this.shopList.splice(index,1);
        this.itemSelectedCarrito=null;
      }
  }
  existenArticulos(){
    return this.articulos.length>0;
  }
  existeCarrito(){
    return this.shopList.length>0;
  }
  totalDeVenta(){
    let total=0;
    this.shopList.forEach(item =>{
      total+=item.total;
    })
    return total;
  }
  totalDeCostos(){
    let totalCostos=0;
    this.shopList.forEach(item =>{
      totalCostos+=item.costo;
    })
    return totalCostos;
  }
  stopPropagation(event){
    event.stopPropagation();
 }
 cerrarModal(){
    this.mostrarModal=false;
 }
 /************* FOOTER CLIENTE************/
 switchFooter(){
   /*console.log("mostrar");
   this.mostrarModal=!this.mostrarModal;
   console.log(this.mostrarModal);*/
   //this.footerAbierto= !this.footerAbierto;
  if (!this.clienteFooter.classList.contains("abierto"))
    this.clienteFooter.classList.add( "abierto");
  else this.clienteFooter.classList.remove( "abierto");
}
  bajarFooter(){
    if (this.clienteFooter.classList.contains("abierto"))
      this.clienteFooter.classList.remove( "abierto");
  }
  buscarCliente(){
   /* if(this.busquedaCliente && this.busquedaCliente.length>2){
      this.busquedaCliente =this.busquedaCliente.toUpperCase();
      this.data.getClientes().pipe(takeUntil(this.desubsDatosEstaticos)).subscribe(changes=>{        
        this.clientes=[];
        this.clientes = this.comun.extraerIdDatosSnapshot(changes);
        console.log(this.clientes,"***********");
        })    */
    if(this.busquedaCliente && this.busquedaCliente.length>2){
      this.busquedaCliente =this.busquedaCliente.toUpperCase();
      let sus=this.data.buscarCliente(this.busquedaCliente).subscribe( changes => {             
        if(changes.size>0){
            this.clientes=this.comun.extraerIdDatosGet(changes);
            console.log(this.clientes);
          }else{
            this.comun.alerta("No Encontrado","el nit no existe en la base de datos");
          }
        }
        ,err=>{console.log("Error al cargar: ",err)},
        ()=>{console.log("busqueda Completada");sus.unsubscribe();}
        );
      }
  }
  searchNit(){
    if(this.busquedaNit && this.busquedaNit.length>2){
      this.busquedaNit =this.busquedaNit.toUpperCase();
      let sus=this.data.buscarNit(this.busquedaNit).subscribe( changes => {             
        if(changes.size>0){
            this.clientes=(this.comun.extraerIdDatosGet(changes));
          }else{
            this.comun.alerta("No Encontrado","el nit no existe en la base de datos");
          }
        }
        ,err=>{console.log("Error al cargar: ",err)},
        ()=>{console.log("busqueda Completada");sus.unsubscribe();}
        );
      }
  }
/******************Pocesar Venta ******************/
  procesarVenta(){
    //console.log("**********",this.shopList,"***********");
    if( this.shopList.length <1){
      this.comun.alerta("Upps!","Nada que vender :(")
      return
    }
    if(!this.clienteSeleccionado){
      this.comun.alertaConOps("Sin datos de Cliente", "¿Deséa continuar la venta sin agregar cliente?",()=>{  
        this.clienteSeleccionado=[];
        this.createSellData();
      })
    }else{
      this.createSellData();
    }
  }
  createSellData(){
    // array de items con su id y cantidad para su respectiva actualizacion en FiB
    let vendedor ={usuario:"Isaias Vendedor", nombre:"Isaias Camposeco", otrosDatos:"*-*-*-*"}//this.data.usuario; EDITARPROD
    let items = this.shopList.map( item =>{
    console.log(item,"*********");
      return {
        "item":item.id , 
        "unidades":+item.cantidad, 
        "nombre":item.nombre,
        "marca":item.marca, 
        "tipo":item.tipo,
        "precio":+item.precio,
        "costo":+item.costo,
        "codigo":item.codigo,
        "existencias":item.existencias,
        "limite":item.limite,
      };
    })
    //recoleccion de datos
    let sellData = {
      //test:true,
      items:items,
      total:this.totalDeVenta(),
      costo:this.totalDeCostos(),
      cliente:this.clienteSeleccionado,
      vendedor:vendedor,
    }
    //////////////////////////
    //envio de datos
    console.log(sellData);
    this.data.addVenta(sellData).then( docRef =>{
        console.log("creado ",docRef);
        this.clearData();
        this.comun.alertaToast("Venta Realizada");
        this.search;
        })
        .catch((err)=>{
          console.log("error ", err);
        })
        //limpieza de datos para evitar duplicacion de datos
    }
  clearData(){
    this.shopList.map(item =>{
      item.cantidad=0;
      item.total=0;
      console.log(item);
    });
    this.shopList=[];  
    this.articulos=[];
    this.clienteSeleccionado= this.marcaFiltro= this.tipoFiltro = this.proveedorFiltro= 
    this.busquedaCliente=  this.busquedaNit=  this.busqueda= this.busquedaCodigo=
    this.itemSelected= this.rowSelected=this.itemSelectedCarrito=this.clientes=null;    
    this.etiquetaCliente=this.leyendaSeleccionarCliente ;
  }
  /*****************agregar cliente*****************/
  datosCLienteEmitidos(e){
    let cliente = e;
    let form = this.formClienteComponent.form;
    this.creacionGenerica("clientes",form,cliente,"Cliente Agregado");
  }
  creacionGenerica(nombreColeccion:string, form:FormGroup,data:{},mensajeExito:string){
    this.comun.darFormato(data);//formato de mayusculas y cambio de string a number 
    form.disable();
    console.log(data,"***********");
    this.data.crearDataGenerica(nombreColeccion,data).then(()=>
      {        
        form.reset();
        form.enable();
        this.comun.alerta("Éxito",mensajeExito);
        this.mostrarModal=false;
      }).catch(err=> {console.log(err,"**");this.comun.alerta("Error","ha ocurrido un error inesperado")});
  }
  seleccionarCliente(cliente){
    this.clienteSeleccionado=cliente;
    console.log(cliente);
    this.etiquetaCliente=`${cliente.nombre} Nit: ${cliente.nit}`;
    this.switchFooter();
  }

}
