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
    console.log(nombre,marca,categoria,proveedor);
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
        .where('categoria','==',categoria)
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
    console.log(data);
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
    console.log(nombre,marca,categoria,proveedor,"********");
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
        .where('categoria','==',categoria)
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
    return this.db.collection('marca',ref => ref.orderBy('nombre',"desc")).snapshotChanges();
  }
  getTipoEditar(){
    return this.db.collection('tipo',ref => ref.orderBy('nombre',"desc")).snapshotChanges();
  }
  getProveedorEditar(){
    return this.db.collection('proveedor',ref => ref.orderBy('nombre',"desc")).snapshotChanges();
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
  /************* FIN EDICION DATOS ****************/
  
  /******************** REPORTES ********************/
    getVentas(initDay,endDay){
      //console.log(initDay, endDay);
      //const ref =this.db.collection('ventas');
      return this.db.collection('ventas', 
           ref => ref.where('fecha','<',endDay).where('fecha','>',initDay).orderBy('fecha','desc')).get();
    }
      /******************** REPORTES ********************/

    getVentasReporte(initDay,endDay){
      //console.log(initDay, endDay);
      //const ref =this.db.collection('ventas');
      //console.log(this.db.persistenceEnabled$);
     // return this.db.firestore.collection('ventas').orderBy('fecha').startAt(initDay).endAt(endDay);// get({source:'server'}); 
     /*let query = this.db.firestore.collection('ventas').orderBy('fecha').startAt(initDay).endAt(endDay);
     return query.onSnapshot({includeMetadataChanges:true},  snap=> { 
			this.ventas=[];
			snap.forEach(venta=>{
					console.log(venta.data());
					let res = {id:venta.id, ...venta.data() };
					this.ventas.push(res);
					this.total += +venta.data().total;
					this.totalCosto+=+venta.data().costo;
				})
				console.log("********",this.ventas);
				this.datosVenta = true;
				//unsubs();
		}*/
    
     // return this.db.collection('ventas', ref => ref.where('fecha','<=',endDay).where('fecha','>=',initDay).orderBy('fecha','desc').limit(5000)).stateChanges()
     return this.db.collection('ventas', ref => ref.where('fecha','<=',endDay).where('fecha','>=',initDay).orderBy('fecha','desc')).snapshotChanges();
    }
     public borrarVenta(id){
       /*********modificar produccion hacer un update a la db al documento "eliminarVetas"
        * para poder enviar el usuario que elimina la venta, parte de esta funcionalidad esta en functions/index.js ********/
       return this.db.collection('ventas').doc(id).delete();
     }
        regresarItems(itemsDeVuelta){
       let date= firebase.firestore.FieldValue.serverTimestamp();
      // console.log(itemsDeVuelta);
       for(let item of itemsDeVuelta){
       //  console.log(item);
       this.db.collection("articulos").doc(item.item).ref.get().then(doc=>{
        let valorActual=item.unidades + doc.data().existencias;
        console.log(valorActual)   
        this.db.collection("articulos").doc(item.item).update({
          "existencias" : valorActual,
          "fechaDeModificacion":date,
        }).then(x=>{
          console.log(x);
         console.log("items regresados");
        });
       });   
      }     
     }
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
 		
    console.log(nombre,marca,tipo);
    //
    return this.db.collection('articulos', ref => {
     //creacion de arreglo de busqueda dependiendo de los valores ingresados sintaxis copiada
     let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
     if(marca && tipo){
       query= query.where('marca','==',marca)
       .where('tipo','==',tipo)
       .where('nombre','>=',nombre)
       .orderBy('nombre','asc').limit(limite);
     }else if(marca){
       query=query.where('marca','==',marca)
       .where('nombre','>=',nombre)
       .orderBy('nombre','asc').limit(limite);
     }else if(tipo){
       query=query.where('tipo','==',tipo)
       .where('nombre','>=',nombre)
       .orderBy('nombre','asc').limit(limite);
     }else{
       query=query.where('nombre','>=',nombre)
       .orderBy('nombre','asc').limit(limite);
     }
     return query;
     }).snapshotChanges();	
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