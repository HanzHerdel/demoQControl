import { Injectable } from '@angular/core';
import { AlertController, ToastController,LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ComunService {
  camposNumericos:Array<string>=['costo','existencias','limite','precio']
  camposString:Array<string>=['nombre','marca','proveedor','tipo']
  constructor(private alertCtrl:AlertController,private toastCtrl:ToastController,private loading:LoadingController) {
    
   }   
   /* EXTRACCION DE DATOS SUBS FIREBASE */
   /************obtener data + id de un query 'get' *************/
   extraerIdDatosGet(querySnap,camposACapitalizar=[]){
    let datos=[]
    querySnap.forEach(a => {
      const data =a.data() as any; 
      const id =a.id;     
      camposACapitalizar.map(key=>data[key]=this.capitalizar(data[key]))
      datos.push( {id,  ...data});
    });
    return datos
   }

   extraerIdDatosSnapshot(querySnap){
     let arrayDatos=[];
    querySnap.forEach(data=>{
      const datos =  data.payload.doc.data() as any;
      const id = data.payload.doc.id;
      arrayDatos.push({ id,  ...datos });  
    })
    return arrayDatos;

   }
   extraerIdData(documentSnap, camposACapitalizar=[]){
     let data=[];
     documentSnap.map(a => {
      const data = a.payload.doc.data() as any;                 
      camposACapitalizar.map(key=>data[key]=this.capitalizar(data[key]))
      const id = a.payload.doc.id;
      let resEd = { id,  ...data };
      data.push(resEd);
      });
      return data;
   }
  /* FIN EXTRACCION DE DATOS SUBS FIREBASE */
/* FORMATOS DATOS */
   /********* dar formato uppercase a los textos y numero a los numeros en strings */
   darFormato(data){
    for(let key in data){
      console.log(key);
      if(this.camposNumericos.includes(key)){
        data[key] = parseInt(data[key]);
      }else if(this.camposString.includes(key)){
        data[key] = data[key].toString();
        try{data[key] = data[key].toUpperCase();}catch{err=>console.log(err)}
      }
     /* try{data[key] = data[key].toUpperCase();}catch{}
     if(!isNaN(data[key])) data[key] = data[key].toString();    */
    }
  }
  /********* formato de primera letra mayuscula para desplegar las tablas *********/
  capitalizar(str) 
  {    
    let original = str;
    try{     
      str = str.split(" ");
      for (var i = 0, x = str.length; i < x; i++) {
          str[i] = str[i][0].toUpperCase() + str[i].substr(1).toLowerCase();
      }      
      return str.join(' ');
      }catch{}      
    return original;
  }
/* FIN FORMATOS DATOS */ 
/* FIN MENSAJES/ALERTAS  */
  async alertaToast(mensaje:string) {
    const toast = await   this.toastCtrl.create({      
      translucent:true,
      message: mensaje,
      duration:2200,
    });
    toast.present();
  }
  async alerta(titulo='',subTitulo='',mensaje='',tiempo=2000) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subTitulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
    setTimeout(()=>{try{alert.dismiss()}catch{}}, tiempo);
  }
  async alertaError(){
    const alert = await this.alertCtrl.create({
      header: "Error",
      subHeader: "Ha ocurrido un error inesperado",
      buttons: ['OK']
    });
    await alert.present();
    setTimeout(()=>{try{alert.dismiss()}catch{}}, 2000);
  }
  async eliminarAlert( nombreEliminado:string,callBack) {
    const alert = await this.alertCtrl.create({
      header:"Advertencia",
      subHeader:"Esta a punto de eliminar:",
      message:nombreEliminado,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {            
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            callBack();
          
          }
        }
      ]
    });
      await alert.present();
  }
  async alertaConOps(titulo:string="", text:string="",callback) {
    let alert = await this.alertCtrl.create({
      header:titulo,
      subHeader:text,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
              
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
          callback();
          }
        }
      ]
    });
    alert.present();
  }
  async crearLoading(mensaje:string,duracion:number=0) {
    const loading = await this.loading.create({
      message: mensaje,
      translucent: true,
      duration: duracion,
      spinner:'dots',
    });
    return loading

  }
/* FIN MENSAJES/ALERTAS  */
}
