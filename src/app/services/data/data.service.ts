import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { snapshotChanges } from '@angular/fire/database';
import { take, first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public db: AngularFirestore) { }
  getFechaFirestore():firebase.firestore.FieldValue{
    return firebase.firestore.FieldValue.serverTimestamp();
   }
  /********** busqueda de articulos *************/
  buscarItemsFullFiltros(nombre="",marca=null, categoria=null,proveedor=null,limite:number=40){ 		
    return this.db.collection('articulos', ref => {
      //creacion de arreglo de busqueda dependiendo de los valores ingresados
        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query=query.where('nombre','>=',nombre);
        //concatenar queries si vienen incluidas
        if( proveedor)query= query && query.where('proveedor','==',proveedor)
        if(categoria)query= query && query.where('tipo','==',categoria)
        if(marca)query=query&& query.where('marca','==',marca) 
        return query && query.orderBy('nombre','asc').limit(limite);
     }).snapshotChanges();	
 }
  public buscarPorCodigo(codigo,limite:number=40){
    return this.db.collection('articulos', ref => 			
            ref.where('codigo','==',codigo).limit(limite)).get();	
  }
  public buscarNit(nit,limite:number=10){
    return this.db.collection('clientes', ref =>
            ref.where('nit','>=',nit).limit(limite)).get();
  }
  public buscarCliente(nombre,limite:number=10){
    return this.db.collection('clientes', ref =>
            ref.where('nombre','>=',nombre).limit(limite)).get();
  }
  /******************* fin busqueda articulos ********************/
  /***************** VENTAS ******************/
  public addVenta(venta){
    let fecha= firebase.firestore.FieldValue.serverTimestamp();
    venta.fecha=fecha;
    return this.db.collection("ventas").add(venta);
  }
  /************FIN VENTAS *******************/
  /******************* creacion y obtencion de datos *************************/
  crearItem(data){
    let fecha=firebase.firestore.FieldValue.serverTimestamp();
    data.fechaDeCreacion=fecha;
    data.fechaDeModificacion=fecha;
    return this.db.collection('articulos').add(data);
  }
  crearProveedor(data){
    return this.db.collection('proveedor').add(data);
  }
  getProveedores(){
    return this.db.collection('proveedor',ref => ref.orderBy('nombre',"desc")).valueChanges();
  }
  crearTipo(data){
    return this.db.collection('tipo').add(data);
  }
  getTipos(){
    return this.db.collection('tipo',ref => ref.orderBy('nombre',"desc")).valueChanges();
  }
  crearMarca(data){
    return this.db.collection('marca').add(data);
  }
  getMarcas(){
    return this.db.collection('marca',ref => ref.orderBy('nombre',"desc")).valueChanges();
  }
  crearDataGenerica(coleccion:string,data){
    return this.db.collection(coleccion).add(data);
  }
    /******************* fin creacion y obtencion de articulos *************************/
  /******************* EDICION DATOS *************************/
  buscarItemsEditar(nombre="",marca=null, categoria=null,proveedor=null,limite:number=40){ 		
    return this.db.collection('articulos', ref => {
     //creacion de arreglo de busqueda dependiendo de los valores ingresados sintaxis copiada
     let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
     if(marca && categoria && proveedor){
      query= query
        .where('proveedor','==',proveedor)
        .where('marca','==',marca)
        .where('tipo','==',categoria)
        .where('nombre','>=',nombre)
        .orderBy('nombre','asc').limit(limite);
    }else if(categoria && proveedor){
      query= query
        .where('tipo','==',categoria)
        .where('proveedor','==',proveedor)
        .where('nombre','>=',nombre).orderBy('nombre','asc').limit(limite);
    }else if(marca && proveedor){
      query= query
        .where('marca','==',marca)
        .where('proveedor','==',proveedor)
        .where('nombre','>=',nombre).orderBy('nombre','asc').limit(limite);
    }else if(marca && categoria){
       query= query
        .where('marca','==',marca)
        .where('tipo','==',categoria)
        .where('nombre','>=',nombre).orderBy('nombre','asc').limit(limite);
     }else if(marca){
       query=query
        .where('marca','==',marca)
        .where('nombre','>=',nombre).orderBy('nombre','asc').limit(limite);
     }else if(categoria){
       query=query
       .where('tipo','==',categoria)
       .where('nombre','>=',nombre).orderBy('nombre','asc').limit(limite);
     }else if(proveedor){
      query=query
      .where('proveedor','==',proveedor)
      .where('nombre','>=',nombre).orderBy('nombre','asc').limit(limite);
    }else{
       query=query.where('nombre','>=',nombre)
       .orderBy('nombre','asc').limit(limite);
     }
     return query;
     }).get();	
  }
  getMarcasEditar(){
    return this.db.collection('marca',ref => ref.orderBy('nombre',"asc")).snapshotChanges();
  }
  getTipoEditar(){
    return this.db.collection('tipo',ref => ref.orderBy('nombre',"asc")).snapshotChanges();
  }
  getProveedorEditar(){
    return this.db.collection('proveedor',ref => ref.orderBy('nombre',"asc")).snapshotChanges();
  }
  editarDataGenerica(id:string,colleccion:string,data){
    let fechaDeModificacion=firebase.firestore.FieldValue.serverTimestamp();
    data.fechaDeModificacion=fechaDeModificacion;
    //agregar en entorno de produccion
    //data.usuarioModificador=this.user
    return this.db.collection(colleccion).doc(id).update(data);
  }
  
  eliminarItemGenerico(id:string,coleccion:string){
    //modificar en produccion para generar los datos del usuario que lo elimina
    //data.usuario=this.usr;
    //return this.db.collection("eliminaciones").doc("eliminarArticulo").update(data);
    return this.db.collection(coleccion).doc(id).delete();
  }
  public editarItem(id,data){
    return this.db.collection('articulos').doc(id).update(data);
  }	
  public buscarDocumentoGenerico(nombre,coleccion){
    return this.db.collection(coleccion, ref=> ref.where('nombre',"==",nombre)).snapshotChanges();
  }
  public getDocumentoGenerico(id,coleccion){
    return this.db.collection(coleccion).doc(id);
  }
  public getUtimasModificaciones(){
    return this.db.collection('articulos',ref=>ref.orderBy('fechaDeModificacion','desc').limit(15)).valueChanges();
  }
  /*****************VENTAS *************/
  getClientes(){
    return this.db.collection('clientes', ref=> ref.orderBy('nombre')).snapshotChanges();
  }
  /**AGREGAR PAGE */
  public getUtimosAgregados(){
    return this.db.collection('articulos',ref=>ref.orderBy('agregado','desc').limit(15)).valueChanges();
  }
  /************* FIN EDICION DATOS ****************/
  
  /******************** REPORTES ********************/
  getVentas(initDay,endDay){
    return this.db.collection('ventas', 
          ref => ref.where('fecha','<',endDay).where('fecha','>',initDay).orderBy('fecha','desc')).get();
  }
    /******************** REPORTES ********************/

  getVentasReporte(initDay,endDay){
    return this.db.collection('ventas', ref => ref.where('fecha','<=',endDay).where('fecha','>=',initDay).orderBy('fecha','desc')).snapshotChanges();
  }
  public borrarVenta(id){
    /*********modificar produccion hacer un update a la db al documento "eliminarVetas"
    * para poder enviar el usuario que elimina la venta, parte de esta funcionalidad esta en functions/index.js ********/
    return this.db.collection('ventas').doc(id).delete();
  }
  getGastosReporte(initDay,endDay){
    return this.db.collection('gastos', ref => ref.where('fecha','<=',endDay).where('fecha','>=',initDay).orderBy('fecha','desc')).snapshotChanges();
  }
//   regresarItems(itemsDeVuelta){
//   let date= firebase.firestore.FieldValue.serverTimestamp();
// // console.log(itemsDeVuelta);
//   for(let item of itemsDeVuelta){
//   //  console.log(item);
//   this.db.collection("articulos").doc(item.item).ref.get().then(doc=>{
//   let valorActual=item.unidades + doc.data().existencias;
//   this.db.collection("articulos").doc(item.item).update({
//     "existencias" : valorActual,
//     "fechaDeModificacion":date,
//   }).then(x=>{
//     console.log(x);
//     console.log("items regresados");
//   });
//   });   
// }     
//   }
  /** INVENTARIO */
  getAllItems(filtroLimite=false){
    if (filtroLimite)
      return this.db.collection("articulos", ref => ref.where('sobreLimite','==',true)).get()
    else
      return this.db.collection("articulos").get()
  }
  getItemsFullFiltros(nombre="",marca=null, categoria=null,proveedor=null,sobreLimite=false,limite:number=40){     		
    return this.db.collection('articulos', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query=query.where('nombre','>=',nombre);
      if( proveedor)
        query= query && query.where('proveedor','==',proveedor)
      if(categoria)
        query= query && query.where('tipo','==',categoria)
      if(marca)
        query=query&& query.where('marca','==',marca) 
      if(sobreLimite)
        query=query&&query.where('sobreLimite','==',true);
        console.log('query: ',query);
     return query && query.orderBy('nombre','asc').limit(limite);
     }).get();	
 }
  /** FIN INVENTARIO */
  /************************** GRAFICAS *************************/
	/* public getProductosMasVendidos(limite:number=25,){
    return this.db.collection('articulos',ref => ref.orderBy('ventasTotales','desc').limit(limite)).snapshotChanges();
  }*/
  getItemsSinVentas(limit=50){
    return this.db.collection('articulos', 
       ref => ref.where('ventasTotales','==',0).limit(limit)).get();
  }
  getItemsEstancados(fechaFiltro,limit:number=100){
    return this.db.collection('articulos', 
         ref => ref.where('ultimaVenta','<',fechaFiltro).limit(limit)).get();
  }
  public getHistorialItem(initDay, endDay,articuloId:string){
    return this.db.collection('articulos').doc(articuloId).collection('historial',ref=> ref.where('fecha','<',endDay).where('fecha','>',initDay).orderBy('fecha','asc')).get();
  }
  public getProductosMenosVendidos(limite:number=25){
    return this.db.collection('articulos',ref => ref.orderBy('ventasTotales','asc').limit(limite)).snapshotChanges();	
  }
  
  public getProductosMejoresGanancias(limite:number=25){
    return this.db.collection('articulos',ref => ref.orderBy('ganancias','desc').limit(limite)).snapshotChanges();	
  }
  public getProductosMenoresGanancias(limite:number=25){
    return this.db.collection('articulos',ref => ref.orderBy('ganancias','asc').limit(limite)).snapshotChanges();	
  }
  public buscarCodigo(codigo,limite:number=40){
    return this.db.collection('articulos', ref => 			
           ref.where('codigo','==',codigo).limit(limite)).snapshotChanges();	
  }
  getItems(marca=null, tipo=null,nombre="",limite:number=40){
    return this.db.collection('articulos', ref => {
     //creacion de arreglo de busqueda dependiendo de los valores ingresados sintaxis copiada
     let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query=query.where('nombre','>=',nombre);
      if(marca)
        query=query && query.where('marca','==',marca);
      if(tipo)
        query=query && query.where('tipo','==',tipo);
      return query &&query.orderBy('nombre','asc').limit(limite);
     }).snapshotChanges();	
 }
 getGastosGraficas(initDay,endDay){
  return this.db.collection('gastos', ref => ref.where('fecha','<=',endDay).where('fecha','>=',initDay).orderBy('fecha','desc')).get();
}
    /************************** FIN GRAFICAS *************************/

    /******************funciones especiales ***************/
   /* articulos:any=[]
     getArticulos(){
      this.articulos=[];
      console.log("obteniendoDatos")
       this.db.collection('articulos').get().subscribe(changes=>{
          changes.forEach(querySnap => {
          const data =querySnap.data() as any;                  
          //capitalizar campos requeridos para un mejor despliegue
          const id =querySnap.id;
          this.articulos.push({ id,  ...data });
          });
          console.log(this.articulos);
        });
      }
    modificarArticulos(){
      console.log("formateando");
      this.articulos.forEach(element => {
        //let data={};
        //const precio =+element.precio;
        //data['precio']=Math.floor((precio+4)*1.6);
        console.log(element);
        let estadoLimite:boolean;
        //if(+element.limite==0 || !element.limite)data['limite']=2;
        if(+element.existencias<=+element.limite) 
          {
            estadoLimite=true;
          }
          else{
            estadoLimite=false;
        };
        //if(element.proveedor=="")data['proveedor']="ANDRES SERRA";
        //console.log(data);
        this.db.collection('articulos').doc(element.id).update({
          sobreLimite:estadoLimite
        }).then((d)=>console.log(d)).catch(err=>console.log(err));
      })
      console.log("finito");
    }*/

    
}
