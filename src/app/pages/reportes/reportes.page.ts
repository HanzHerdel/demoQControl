import { Platform } from '@ionic/angular';
import { ComunService } from './../../services/comun.service';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription, Subject } from 'rxjs';
import { animate, style, transition, trigger,state } from '@angular/animations';
import { IMyDpOptions } from 'mydatepicker/';
//import { File } from '@ionic-native/file/ngx';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { takeUntil } from 'rxjs/operators';

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
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
export class ReportesPage implements OnInit {
  selectedItem: any;
	ventas: any[]=[];
	clientes: any;
	total: number=0;;
  totalCosto:number=0;
  costos=false;
    /************* subjet para destruir subscripcion **************/
  desubsripcion = new Subject<void>();
  subscripcionVentas= new Subscription;
  /* VARIABLES DATE PICKER */
  initDate: Date;
	endDate: Date;
	datePickerInicio: any;	
	datePickerFin: any;	
  datosVenta: boolean = false
	myDatePickerOptions: IMyDpOptions = {
		dateFormat: 'dd de mmm',
		dayLabels: { su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mié', th: 'Jue', fr: 'Vie', sa: 'Sáb' },
		monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' },
		showTodayBtn: true,
		allowDeselectDate: false,
		showClearDateBtn: false,
		todayBtnTxt: "Hoy",
		alignSelectorRight: true,
		inline: false,
		width: "90%",
		editableDateField: false,
		openSelectorOnInputClick: true,
		markCurrentDay: true,
  };
  /* FIN VARIABLES DATEPICKER */
	/* GENERAR PDF */ 
	pdfObj = null;
  constructor(private data:DataService,  private comun: ComunService, private platform:Platform, private file:File, private fileOpener:FileOpener) { }

  ngOnInit() {
    this.establecerFechaActual();
    this.buscarVentas();
  }
  ngOnDestroy() {
	this.desubsripcion.next();
    this.desubsripcion.complete();
  }
  establecerFechaActual() {
		let date = new Date();		
		 date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		this.initDate = date;
		let d = this.initDate.getTimezoneOffset();
		this.initDate.setDate(this.initDate.getDate());
		//this.initDate.setDate(this.initDate.getDate()-(10));//fecha cambiada para tomar mas datos comentar en prod
		this.initDate.setTime(this.initDate.getTime() + (d * 60 * 1000));
		this.datePickerInicio = { date: { year: this.initDate.getFullYear(), month: this.initDate.getMonth() + 1, day: this.initDate.getDate() } };		
		date = new Date()
		this.endDate = date;
		this.endDate.setDate(this.endDate.getDate());
		this.endDate.setHours(23,59,59,999);
		this.datePickerFin = { date: { year: this.endDate.getFullYear(), month: this.endDate.getMonth() + 1, day: this.endDate.getDate() } };
	}
	dateEndChanged(event) {
		this.endDate = event.jsdate;
		this.endDate.setDate(this.endDate.getDate() + 1);
		//	console.log(this.endDate, "event");
		this.buscarVentas();
	}
	dateInitChanged(event) {
		this.initDate = event.jsdate;
		console.log(this.initDate, "event");
		this.buscarVentas();
	}
	buscarVentas() {
		this.datosVenta = false;
		console.log("buscando");	
		this.desubsripcion.next();
		this.subscripcionVentas= this.data.getVentasReporte(this.initDate, this.endDate).pipe(takeUntil(this.desubsripcion))

		.subscribe(data => {					
			this.ventas = [];
			this.total = 0;
			this.totalCosto=0;	
				data.map(venta => {
					const data = venta.payload.doc.data() as any;
					const id = venta.payload.doc.id;
					let res = { id, ...data };
					this.ventas.push(res);
					 this.total += +data.total;
					// this.ventas.push({...venta.data(), id:venta.id});
					this.totalCosto+=+data.costo;
				});
				this.datosVenta = true;
				console.log("********",this.ventas);
				//sub.unsubscribe();
				}
		)
	}

	eliminarVenta(venta) {
		this.comun.alertaConOps("Eliminar Venta","¿Está seguro de eliminar esta venta?", ()=>{
			this.data.borrarVenta(venta.id).then(a => {
				this.comun.alerta("Venta Deshecha", "Los artículos estan siendo regresados a la base de datos");
				this.buscarVentas();
			}).catch(err => { console.log(err) });
		} )
	}
	generatePdf(){
		if (this.ventas.length > 0 ){
			let bodyData=[];
			//let i=1;
			let total=0;
			/** variables de fecha para mostrar el rango de fechas */
			let fechaInicio=this.initDate.getDate()+"/" +(this.initDate.getMonth()+1)+"/"+this.initDate.getFullYear();
			let fechaFin=this.endDate.getDate()+"/" +(this.endDate.getMonth()+1)+"/"+this.endDate.getFullYear();
			/*generacion de la tabla*/
			let encabezado = [
							{text:"Fecha.", fontSize: 14, bold:true, alignment: 'left'},
							{text:"Cliente", fontSize: 14, bold:true, alignment: 'center'},
							{text:"U.", fontSize: 14, bold:true, alignment: 'center'},
							{text:"Producto", fontSize: 14, bold:true, alignment: 'center'},
							{text:"Precio", fontSize: 14, bold:true, alignment: 'center'}];
			bodyData.push(encabezado);
			this.ventas.forEach(venta=> {
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
		/* creacion del objeto pdf */
			pdfmake.vfs = pdfFonts.pdfMake.vfs;
			//console.log(bodyData);
			var docDefinition = {
			content: [
			{
			columns: [
				/**cabecera del documento, los estilos estan definidos abajo */
						[
						{ text: 'Quetzaltech', style: 'header' },
						{ text: 'Soluciones Modernas', style: 'sub_header' },
						{ text: 'Teléfonos: 7765-4193 / 5923-1542', style: 'normal' },
						{ text: 'Dirección: Calle Rodolfo Robles 16-12 Quetzaltenango', style: 'normal' },
						{text:""},
						]
					]
				},
				{  
					margin:[ 0, 35, 0, 20 ],style: 'filaProducto',layout: 'lightHorizontalLines',
					table: 
					{    
					headerRows: 1,
					widths: [ 52,45,25,270,50],                                               
					body: 
						bodyData                    
						}
					},
					{  
						columns: [
							/**fin del documento registrando el total y fechas de rango */
									[
									{ text: 'Total de Ventas del '+ fechaInicio +' al ' + fechaFin+' Q.'+ total.toString(), style: 'normal' },
									]
								]
						}  
				],
				styles: {
				header: {
				bold: true,
				fontSize: 20,
				alignment: 'right'
				},
				sub_header: {
				fontSize: 17,
				alignment: 'right'
				},
				normal: {
				fontSize: 14,
				alignment: 'right'
				},
				filaProducto: {
						fontSize: 8,
						bold: false,
						alignment: 'center',                   
					},
				},
				pageSize: 'A4',
				pageOrientation: 'portrait'
			};
			this.pdfObj= pdfmake.createPdf(docDefinition);
			this.downloadPdf();
		}
	}
	downloadPdf() {


	if (this.platform.is('cordova')) {
		this.pdfObj.getBuffer((buffer) => {
			var blob = new Blob([buffer], { type: 'application/pdf' });
			let date= new Date(); 
			const fecha =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
			const nombre=`reporte${fecha}.pdf`;
			this.file.writeFile(this.file.externalApplicationStorageDirectory, nombre, blob, { replace: true }).then(fileEntry => {
				this.comun.alerta(fileEntry.toInternalURL(),"asdf");
				this.fileOpener.open(fileEntry.toInternalURL(), 'application/pdf');
			}).catch(err=>this.comun.alerta("Err",err))
		});
	} else {
		this.comun.alerta("nel");
		this.pdfObj.download();
		}
	}  
	
}
