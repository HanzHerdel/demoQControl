import { DescargasService } from './../../services/descargas/descargas.service';
import { ComunService, animacionPag } from './../../services/comun.service';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription, Subject } from 'rxjs';
import { animate, style, transition, trigger,state } from '@angular/animations';
import { IMyDpOptions } from 'mydatepicker/';
//import { File } from '@ionic-native/file/ngx';

import { takeUntil } from 'rxjs/operators';


import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  animations: [
	animacionPag(),
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
		trigger('animacionNgIfDelay', [      
			transition(':enter', [
			  style({ height: 0, opacity: 0 }),
			  animate('.5s .5s ease-out', 
					  style({ height: 32, opacity: 1 }))
			]),
			transition(':leave',          [
			  style({ height: 32, opacity: 1 }),
			  animate('.5s ease-in', 
					  style({ height: 0, opacity: 0 }))
			  ]),
			  ]
			),
    ]
})
export class ReportesPage implements OnInit {
	/*VARIABLES VENTAS*/
	ventas: any[]=[];
	total: number=0;
	totalCosto:number=0;
	costos=false;
	/**FIN VARIABLES VENTAS  */
	/*VARIABLES GASTOS*/
	gastos=[];
	totalGastos:number;
	/*FIN VARIABLES GASTOS*/
	/*DESUBSCRIPCION DE DATOS*/
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

  constructor(private data:DataService, private platform:Platform, private comun: ComunService, private file:File, private fileOpener:FileOpener, private descargas:DescargasService) { }

  ngOnInit() {
    this.establecerFechaActual();
    this.buscarReportes();
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
		this.buscarReportes();
	}
	dateInitChanged(event) {
		this.initDate = event.jsdate;
		console.log(this.initDate, "event");
		this.buscarReportes();
	}
	buscarReportes() {
		this.datosVenta = false;
		console.log("buscando");	
		this.desubsripcion.next();
		this.data.getVentasReporte(this.initDate, this.endDate).pipe(takeUntil(this.desubsripcion))
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
							this.totalCosto+=+data.costo;
						});
						this.totalCosto=Math.round(this.totalCosto * 100) / 100; 
						this.total=Math.round(this.total * 100) / 100; 
						this.datosVenta = true;
						}
					)
		this.data.getGastosReporte(this.initDate, this.endDate).pipe(takeUntil(this.desubsripcion))
						.subscribe(data=>{
							this.gastos=[];
							this.totalGastos = 0;
							data.map(venta => {
								const data = venta.payload.doc.data() as any;
								const id = venta.payload.doc.id;
								let res = { id, ...data };
								this.gastos.push(res);
								this.totalGastos+=+data.cantidad;
							});
							this.totalGastos=Math.round(this.totalGastos * 100) / 100;
							this.datosVenta = true; 
						})
	}

	eliminarVenta(venta) {
		this.comun.alertaConOps("Eliminar Venta","¿Está seguro de eliminar esta venta?", ()=>{
			this.data.borrarVenta(venta.id).then(a => {
				this.comun.alerta("Venta Deshecha", "Los artículos estan siendo regresados a la base de datos");
				this.buscarReportes();
			}).catch(err => { console.log(err) });
		} )
	}
	async generarPdf(){
		if (this.ventas.length > 0 ){
			let loading =await this.comun.crearLoading("Creando");
			await loading.present();
			let bodyData= this.descargas.generaTablaDeDatosReporte(this.ventas);
			let fechaInicio=this.initDate.getDate()+"/" +(this.initDate.getMonth()+1)+"/"+this.initDate.getFullYear();
			let fechaFin=this.endDate.getDate()+"/" +(this.endDate.getMonth()+1)+"/"+this.endDate.getFullYear();
			  /* creacion del objeto pdf */
			console.log("***",bodyData);
			pdfmake.vfs = pdfFonts.pdfMake.vfs;

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
						/** tabla de datos */
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
							[{ text: 'Total de Ventas del '+ fechaInicio +' al ' + fechaFin+' Q.'+ this.total.toString(), style: 'normal' },]
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
			let pdfObj=pdfmake.createPdf(docDefinition);
			await loading.dismiss();
			this.descargarPdf(pdfObj);
		}
	}
	descargarPdf(pdfObj){			
		let date= new Date(); 
		const fecha =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
		const nombre=`reporte-${fecha}.pdf`;
		if (this.platform.is('cordova')){	
			let rootDir=this.file.externalRootDirectory;
			pdfObj.getBuffer((buffer) => {
			var blob = new Blob([buffer], { type: 'application/pdf' });
			this.file.checkDir(rootDir, 'Reportes')
				.then(x => {			
					this.comun.alerta("descargando: ","","",2000);
					this.file.writeFile(rootDir +'/Reportes/', nombre, blob, { replace: true }).then(fileEntry => {
					this.comun.alerta("Archivo descargado: ",fileEntry.toInternalURL(),"",2000);
					this.fileOpener.open(fileEntry.toInternalURL(), 'application/pdf');
					}).catch(err=>{console.log(err)})
				})
				.catch(err => 
				{						
				console.log(err);
				this.file.createDir(rootDir,'Reportes',false).then(res=>{
					this.file.writeFile(rootDir +'/Reportes/', nombre, blob, { replace: true }).then(fileEntry => {
					this.comun.alerta("Archivo descargado",fileEntry.toInternalURL());
					this.fileOpener.open(fileEntry.toInternalURL(), 'application/pdf');
					}).catch(err=>{console.log('err: ', err)})
					
				})
				});
		
			});
		}
		else{			
			pdfObj.download(nombre);
		}
	}
	
}
