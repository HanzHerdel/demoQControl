import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ComunService } from '../comun.service';

@Injectable({
  providedIn: 'root'
})
export class DescargasService {
   link = 'url_to_download_file';
   path = '';
   dir_name = 'Download'; // directory to download - you can also create new directory
   file_name = 'file.txt'; //any file name you like
	/* GENERAR PDF */ 
constructor(){}


descargarArchivo(){
  //fileTransfer.download()
/*  let result = this.file.createDir(this.file.externalRootDirectory, dir_name, true);
  result.then((resp) => {
    path = resp.toURL();
    console.log(path);
    fileTransfer.download(link, path + file_name).then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      console.log(error)
    });
  }, (err) => {
    console.log('error on creating path : ' + err);
  });*/
  }
  generaTablaDeDatosReporte(ventas){

    let bodyData=[];
    //let i=1;
    let total=0;
    /*generacion de la tabla*/
    let encabezado = [
            {text:"Fecha.", fontSize: 14, bold:true, alignment: 'left'},
            {text:"Cliente", fontSize: 14, bold:true, alignment: 'center'},
            {text:"U.", fontSize: 14, bold:true, alignment: 'center'},
            {text:"Producto", fontSize: 14, bold:true, alignment: 'center'},
            {text:"Precio", fontSize: 14, bold:true, alignment: 'center'}];
    bodyData.push(encabezado);
    ventas.forEach(venta=> {
      //console.log(venta);
      let dataRow=[];
      let date= new Date(venta.fecha.seconds*1000);		   
    /* en la cabecera de cada venta se agrega el nit del cliente y la fecha*/
      const fecha =date.getDate()+"/" +(date.getMonth()+1)+"/"+date.getFullYear(); 
      dataRow.push(fecha);
      dataRow.push(venta.cliente.nit || "no cliente");
      dataRow.push("---");
      dataRow.push("---");
      dataRow.push("---");
      bodyData.push(dataRow);
      /*por cada item en la venta se genera una linea */
      venta.items.forEach(item =>{
      let itemRow=[]
      itemRow.push("---");
      itemRow.push("---");
      itemRow.push(item.unidades.toString());
      itemRow.push(item.nombre +" - " +item.marca||"" + " - " + (item.tipo||"") );
      itemRow.push(item.precio);
      bodyData.push(itemRow)
      });
      let totalRow=["","","","","total: Q"+venta.total]
      total+=venta.total;
      bodyData.push(totalRow);
      /* al final de cada venta agregamos una linea extra para separarlo */
      bodyData.push(["","","","",""]);
      //i++;
    });

    return bodyData
  }

}