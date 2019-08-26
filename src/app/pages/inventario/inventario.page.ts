import { ComunService } from './../../services/comun.service';
import { Component, ViewChild, Renderer2,OnInit } from '@angular/core';
import { FormDinamicoComponent } from 'src/app/formsDinamicos/form-dinamico/form-dinamico.component';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription, Subject } from 'rxjs';
import { animate, style, transition, trigger,state } from '@angular/animations';
import { campoBase } from 'src/app/formsDinamicos/campo-base';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
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


    ],
})
export class InventarioPage implements OnInit {
    /////////////////declaracion de variables de busqueda
    tipoFiltro:string="";
    marcaFiltro:string="";
    proveedorFiltro:string="";
    busqueda:string="";
    busquedaCodigo:string="";
    articulos=[];
    articulosLimite
    categorias=[];
    proveedores=[];
    marcas=[];
    desubsripcionArticulos = new Subject<void>();
    /* variables handler lector de codigo de barras*/
    detenerEventoLector:any;
    leyendo:boolean=false;
    handler:any;
    codigo:string="";
    /************* subjet para destruir subscripcion al salir **************/
    desubsDatosEstaticos = new Subject<void>();
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
    /* LIMITE */
    filtroLimite:boolean=false;
    /* todos loa articulos para ocultar y cargar toda la base de datos */
    todosLosArticulos:boolean=false;
  constructor(private data:DataService, private renderer2:Renderer2, private comun: ComunService,) { }

  ngOnInit() {
    /*************************/
    this.suscripcionesDatos();  
    this.detenerEventoLector =  this.eventoLector();  

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
      let sub =this.data.buscarPorCodigo(this.busquedaCodigo).subscribe( 
        changes => {             
          if(changes.size>0){
            this.articulos=this.comun.extraerIdDatosGet(changes,this.camposACapitalizar);
            }else{
              this.comun.alerta("No Encontrado","el artículo no existe en la base de datos");
            }
          },
        err=>console.log(err),
        () =>sub.unsubscribe());
      }
    }
  }
  search(){
  this.busqueda =this.busqueda.toUpperCase();
  this.desubsripcionArticulos.next();
  let sub=this.data.getItemsFullFiltros(this.busqueda,this.marcaFiltro,this.tipoFiltro,this.proveedorFiltro,this.filtroLimite,100)
    .subscribe( 
        changes => {
          console.log(changes);
          this.articulos=this.comun.extraerIdDatosGet(changes,this.camposACapitalizar);
          console.log(this.articulos);
        },
        err => console.log(err)
        ,
        ()=>sub.unsubscribe()
      )
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
      }
  }
  selectRow(id,clase){
    this.rowSelected = document.getElementById(id);
    this.rowSelected.classList.add(clase);
  }
  deSelectRow(clase){
    if (this.rowSelected ){
      this.rowSelected.classList.remove(clase);
      this.rowSelected=null;}
  }
  existenArticulos(){
    return this.articulos.length>0;
  }
  /******************* FIn Funciones interfaz******************/ 
  /**GENERAR PEDIDO */
  toogleFiltroEnAlerta(){
    if(this.todosLosArticulos)
      {        
        this.mostrarTodo()
    }else{
      this.search();
    }
  }
  async mostrarTodo(){
    if(this.todosLosArticulos){
      let loading =await this.comun.crearLoading("Cargando");      
      await loading.present();
      let subsUltimaVenta=  this.data.getAllItems(this.filtroLimite).subscribe(changes=>{
        this.articulos=this.comun.extraerIdDatosGet(changes,this.camposACapitalizar);
          },
          (err)=>{console.log(err);
                 this.comun.alerta("Error","Ha ocurrido un error inesperado") 
                 loading.dismiss();},
          ()=>{
            loading.dismiss();
            subsUltimaVenta.unsubscribe();
          })
      }
  }
  generarPedido(){
    let pedido=[];
    console.log(this.articulos);
    console.log('pedido: ', pedido);
    pedido = this.articulos.map(articulo=>{
      let item={'Unidades':articulo.limite*3,'Nombre':articulo.nombre,'Marca':articulo.marca,'Codigo':articulo.codigo,'id':articulo.id}
      return item;
    })
    console.log('a',this.articulos);
    console.log('p:',pedido);
    const separator = ',';
    const keys = Object.keys(pedido[0]);//obtencion de keys en el objeto 0 del array pedido 
    const csvContent =
      keys.join(separator) + //row encabezado
      '\n' + //salto de linea marca fin de row
      pedido.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];//creacion de celda con cada key y si es null o undef se agrega un string vacio
          cell = cell instanceof Date ? //si es una fecha se hace el cambio a localedatestring
                      cell.toLocaleDateString() : 
                      cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`; // si el string tiene '/n' ',' ó '"' se encierra entre comillas para evitar errores
          }
          return cell;
        }).join(separator);//union de cada celda
      }).join('\n'); // terminar con salto de linea

    const blob = new Blob([csvContent], { type: 'data:application/csv' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, "test1.csv");
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', "test1.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}
