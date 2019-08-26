import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartErrorEvent } from 'ng2-google-charts';
import { Subscription, Subject } from 'rxjs';
import { IMyDpOptions } from 'mydatepicker/';
import { DataService } from 'src/app/services/data/data.service';
import { ComunService } from 'src/app/services/comun.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.page.html',
  styleUrls: ['./graficas.page.scss'],
  animations:[
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
      trigger('genericaNgif', [      
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
	trigger('animacionLimpiarGph', [      
		transition(':enter', [
			style({ 'width': '0px', opacity: 0 }),
			animate('.5s ease-out', 
					style({ 'width': '100px', opacity: 1 }))
		]),
		transition(':leave',          [
			style({'width': '100px', opacity: 1 }),
			animate('.5s ease-in', 
					style({ 'width': '0px', opacity: 0 }))
			]),
		
		]
		),	
  ]
  
})
export class GraficasPage implements OnInit {
////// variables graficos/////////////
 // variables de seleccion de tipos de datos para graficar
 opciones=[
 'Artículos Más Productivos',	 
 'Todas Las Ventas',
 'Historial De Artículo', 	
 'Sin Movimiento',
//	'Historial Artículo'
];
tituloTabla="Todos los Datos (en orden ganancias)";
opcionesChart1={};
opcionesChart2={};
opcionElegida:string; //
  /************************** Variables tabla **********************/
//cabeceras de tabla con los keys de los campos a mostrar, modificar la cantidad de campos en scss 
cabecerasTablaHistorial = [
//{cabecera:'-',key:'existencias',necesario:true},
	{cabecera:'Nombre',key:'nombre',necesario:true}, 
	{cabecera:'Categoría',key:'tipo',necesario:false},             
	{cabecera:'Código',key:'codigo',necesario:true},            
	//{cabecera:'Proveedor',key:'proveedor',necesario:false},
	{cabecera:'Marca',key:'marca',necesario:false}, 
	{cabecera:'Precio',key:'precio',necesario:true},
	{cabecera:'Gan..',key:'ganancias',necesario:true},
	{cabecera:'Ventas',key:'ventas',necesario:true}
];
cabecerasBusqueda=[
	{cabecera:'-',key:'existencias',necesario:true}, 
	{cabecera:'Nombre',key:'nombre',necesario:true}, 
	{cabecera:'Categoría',key:'tipo',necesario:true},             
	{cabecera:'Código',key:'codigo',necesario:true},            
	{cabecera:'Proveedor',key:'proveedor',necesario:false},
	{cabecera:'Marca',key:'marca',necesario:false}, 
	{cabecera:'Precio',key:'precio',necesario:true},
];
//campos que necesitan capitalizacion para mostrar en tabla, no numericos
camposACapitalizar=['nombre','tipo','proveedor','marca'];
/********variables de interfaz tabla**********/
/* VARIABLES GRAFICOS */
	tipoDeChart:string="ColumnChart";//puede ser PieChart o ColumnChart	
	chartUno: GoogleChartInterface;
	chartDos: GoogleChartInterface;
	datosChartUno=[];// =[['Articulo', 'Ventas']];
	datosChartDos=[];//=[['Articulo', 'Ganancias']]
	historialesVentas=[];
	/* VARIABLES GRAFICOS 'MAS PRODUCTIVOS'*/
		sinDatosVentas:boolean=false;//ocultar graficos y leyenda predeterminada de graficos cuando no exista data
		limiteDatos:number=10;
		ventas: any;
		diccionarioArticulosAgrupados:any;
		arrayDeArticulos=[];
		datosVentas: boolean = false; //verificacion de existencia de datos

	/* VARIABLES DE HISTORIAL */
		nItemsEnHistorial:number=1;
		idArticuloEnHistorial:string;//variable para veririfar que no es el mismo articulo
	/* VARIABLES TODAS LAS VENTAS*/
	todasLasVentasLabelFooter:string="";
valorRangoSensibilidad=180;
sensibilidadPieChart:number=0.018;
////////////////// variables intervalo de fechas////////////////////
datePicker1: any;
datePicker2: any;	
initDate: Date;
endDate: Date;
/////////////////declaracion de variables de busqueda en articulo especifico
tipoFiltro:string="";
marcaFiltro:string="";
busqueda:string="";
busquedaCodigo:string="";
tipos:any;
articulos:any=[];
rowSelected:any=null;
itemSelected:any=null;
desubsDatosEstaticos = new Subject<void>();
categorias=[];
proveedores=[];
marcas=[];
///////////////////////
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

///////////////////////// suscripciones ///////////////////////////
subscripcionData:Subscription;
tiposSubscription:Subscription;
desubsripcionArticulos = new Subject<void>();
//////////////////// para anular el evento de resize /////////
ventanaActual:boolean=false;//variable para anular la actualizacion de graficos
	constructor(private data:DataService,  private comun: ComunService) {
	}
	public error(event: ChartErrorEvent) {
		console.log(event);
	  }
	ngOnInit() {
		this.setDates();
		this.ventanaActual=true;
		this.opcionElegida="Todas Las Ventas";
		this.tipoDeChart="LineChart";
		this.opcionesChart1={
			'title':'Todas Las Ventas',
			backgroundColor: '#edffed',
			hAxis: {format : 'M/d'},
			legend: { position: 'none'}
			}
		this.tipoDeChart="LineChart";
		this.opcionesChart2={
				'title':'Todas Las Ganancias',
				backgroundColor: '#edffed',
				hAxis: {format : 'M/d'},
				legend: { position: 'none'}
				}
		this.suscripcionesDatos();		
		this.realizarBusqueda();
	}
	ngOnDestroy() {
		this.ventanaActual=false;		
		this.desubsripcionArticulos.next();		
		this.desubsripcionArticulos.complete();
		this.desubsDatosEstaticos.next();
		this.desubsDatosEstaticos.complete();
	//  this.subscripcionData.unsubscribe();	
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
	existenDatos(datos:any[]){
		let existen = (datos && datos.length >1  ) ? true:false;
		return existen;
	}
	setDates() {
		let date = new Date()
		this.datePicker2= { date: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } };
		date = new Date(Date.UTC(date.getFullYear(), date.getMonth()-1, date.getDate()));
		this.initDate = date;
		//let d = this.initDate.getTimezoneOffset(); verificar funcionalidad
		this.initDate.setDate(this.initDate.getDate());
		//this.initDate.setTime(this.initDate.getTime() + (d * 60 * 1000));	
		//this.initDate.setMonth(this.initDate.getMonth()-1);
		this.datePicker1={ date: {year: this.initDate.getFullYear(), month: this.initDate.getMonth()+1, day: this.initDate.getDate(), }}
		date = new Date()
		this.endDate = date;
		this.endDate.setDate(this.endDate.getDate());
		this.endDate.setHours(23,59,59,999);
	}
	opcionSeleccionada(){
		switch (this.opcionElegida){
			case 'Artículos Más Productivos':				
				this.datosChartDos=this.datosChartUno=[];
				this.cabecerasTablaHistorial = [
					//{cabecera:'-',key:'existencias',necesario:true},
						{cabecera:'Nombre',key:'nombre',necesario:true}, 
						{cabecera:'Categoría',key:'tipo',necesario:false},             
						{cabecera:'Código',key:'codigo',necesario:true},            
						//{cabecera:'Proveedor',key:'proveedor',necesario:false},
						{cabecera:'Marca',key:'marca',necesario:false}, 
						{cabecera:'Precio',key:'precio',necesario:true},
						{cabecera:'Gan..',key:'ganancias',necesario:true},
						{cabecera:'Ventas',key:'ventas',necesario:true}
					];
				this.tipoDeChart="ColumnChart";
				this.tituloTabla="Todos los Datos (orden en ganancias)";
				this.opcionesChart1={					
						'title':'Ventas Por Producto',
						backgroundColor: '#edffed',
						legend: { position: 'none'}					
					}
				this.opcionesChart2={					
					'title':'Ganancias Por Producto',
					backgroundColor: '#edffed',
					legend: { position: 'none'}					
					}
				this.filtrarVentasPorFechaYArticulo();

			break;
			case 'Historial De Artículo':
				this.datosChartDos=this.datosChartUno=[];
				this.tipoDeChart="ScatterChart";
				this.opcionesChart1={
					hAxis: {
						format : 'M/d',
				//		title: 'Mes',
						textStyle: {
						color: '#01579b',
						//fontSize: 16,
					//	fontName: 'Arial',
						//bold: true,
						//italic: true
						},
					},
					legend: { position: 'bottom', textStyle: { fontSize: 12, bold: true, italic: false }  },
					options: {
						series: {
							0: { pointShape: { type: 'square',  },   pointSize: 18, },
							1: { pointShape: { type: 'circle',  },   pointSize: 10 },
						},
						'title':'Historial de Articulo',
						vAxis: {minValue: 0},

						backgroundColor: '#edffed',
						}
				}
			break;
			case 'Todas Las Ventas':
				this.datosChartDos=this.datosChartUno=[];
				this.tipoDeChart="LineChart";
				this.opcionesChart1={
					'title':'Todas Las Ventas',
					hAxis: {format : 'M/d/'},
					backgroundColor: '#edffed',
					legend: { position: 'none'}
					}
				this.filtrarVentasPorFecha()
			break;
			case 'Sin Movimiento':
				this.tituloTabla=`Artículos Sin Movimiento (Desde ${this.initDate.toDateString()})`;
				this.cabecerasTablaHistorial = [					
						{cabecera:'U.',key:'existencias',necesario:true}, 
						{cabecera:'Nombre',key:'nombre',necesario:true}, 
						{cabecera:'Categoría',key:'tipo',necesario:false},             
						{cabecera:'Código',key:'codigo',necesario:true},            
						//{cabecera:'Proveedor',key:'proveedor',necesario:false},
						{cabecera:'Marca',key:'marca',necesario:false}, 
						{cabecera:'Precio',key:'precio',necesario:true},
						{cabecera:'UltimaVenta',key:'ultimaVenta',necesario:true},
					];
				this.getArticulosSinVentas();
			break;

		}
	}
	realizarBusqueda(){		
		//	'Sin Movimiento',
			if(this.opcionElegida=='Artículos Más Productivos')	this.filtrarVentasPorFechaYArticulo();
			else if(this.opcionElegida=='Historial De Artículo')	this.busquedaHistorial();
			else if(this.opcionElegida=='Todas Las Ventas')this.filtrarVentasPorFecha();
			else if(this.opcionElegida=='Sin Movimiento')this.getArticulosSinVentas();
		}	
	/* ARTICULOS MAS PRODUCTIVOS */
	filtrarVentasPorFechaYArticulo() {
		let subs=this.data.getVentas(this.initDate, this.endDate).subscribe(data => {
			this.diccionarioArticulosAgrupados=this.agruparVentasDeArticulo(data);
			console.log(this.diccionarioArticulosAgrupados);
			this.ordenarArticulosMasProd();
			this.actualizarGraficos();
		},
		(err)=>{console.log(err)},
		()=>{
			console.log('busqueda terminada');
			subs.unsubscribe();
		}
		)
	}
	//agrupa las ventas de articulos en uno mismo y 
	agruparVentasDeArticulo(data){
		let diccionarioArticulosAgrupados:any[]=[];
		data.forEach(venta => {
			const data = venta.data();
			//separar ventas en articulos y agregarle las ventas totales y ganancias
			for(let item of data.items){
				// si el articulo (id) existe (key) agregarle las unidades vendidas y ganancias
				if(diccionarioArticulosAgrupados[item.item]){
					diccionarioArticulosAgrupados[item.item].ventas +=item.unidades;
					let ganancias= Math.round((diccionarioArticulosAgrupados[item.item].ventas*(item.precio-item.costo))* 100) / 100;
					diccionarioArticulosAgrupados[item.item].ganancias = ganancias;
				// sino crear un nuevo key e ingresar las unidades y ganancias de esta venta
				}else{
					diccionarioArticulosAgrupados[item.item]=item;
					diccionarioArticulosAgrupados[item.item].ventas=item.unidades;
					let ganancias= Math.round((item.unidades*item.precio-item.costo)* 100) / 100;;
					diccionarioArticulosAgrupados[item.item].ganancias = ganancias;
					//this.diccionarioArticulosAgrupados.item.ventas =1;
				}
			}
		});
		
		return diccionarioArticulosAgrupados;
	}
	ordenarArticulosMasProd(){
		this.datosChartUno=[];
		this.datosChartDos=[];
		this.arrayDeArticulos=[];
		// crear array para deplegar en los graficos con formato [nombre, numero de ventas],etc
		for(let key in this.diccionarioArticulosAgrupados){
			let color = this.getRandomColor();
			let articuloVentas=[ this.diccionarioArticulosAgrupados[key].nombre, this.diccionarioArticulosAgrupados[key].ventas,color ];
			let articuloGanancias=[ this.diccionarioArticulosAgrupados[key].nombre, this.diccionarioArticulosAgrupados[key].ganancias ,color];
			this.datosChartUno.push(articuloVentas);
			this.datosChartDos.push(articuloGanancias);
			this.arrayDeArticulos.push(this.diccionarioArticulosAgrupados[key]);
		}
		//oredenar array de graficos y agregar encabezado, unshift, para su correcto despliege
		this.datosChartDos.sort(this.ordenarDatos);
		this.datosChartUno.sort(this.ordenarDatos);
		this.datosChartUno.unshift(['Articulo', 'Ventas',{ role: 'style' }]);
		this.datosChartDos.unshift(['Articulo', 'Ganancias',{ role: 'style' }]);
		//asi mismo ordenar datos completos, estas comparaciones necesitan una funcion de comparacion en la cual contra que valores del array se comparan
		this.arrayDeArticulos.sort(this.ordenarPorGanancia);
	}
	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = 'color:#';
		for (var i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	ordenarDatos(a, b){
	  return b[1]-a[1];
	}
	ordenarPorGanancia(a, b) {
	  return b.ganancias - a.ganancias;
	}
	rangoSensibilidadPieChart(){
		this.sensibilidadPieChart=this.valorRangoSensibilidad/1000;
		this.actualizarGraficos();
	}
	limiteDatosColumnChart(){
		this.realizarBusqueda();
	}
  	dateEndChanged(event) {
		this.endDate = event.jsdate;
		this.endDate.setDate(this.endDate.getDate() + 1);
		this.realizarBusqueda();		
	}
	dateInitChanged(event) {
		this.initDate = event.jsdate;
		if(this.opcionElegida=='Sin Movimiento')	
			this.tituloTabla=`Artículos Sin Movimiento (Desde ${this.initDate.toDateString()})`;
		this.realizarBusqueda();		
	}

	leyendaBotonHistorial(){
		return (this.historialesVentas && this.historialesVentas.length>1) ? 'Comparar': 'Ver Historial';
	}
/* FIN ARTICULOS MAS PRODUCTIVOS */
/* TODAS LAS VENTAS */
	filtrarVentasPorFecha(){
		let subs=this.data.getVentas(this.initDate, this.endDate).subscribe(data => {
			let arrayVentasDia= this.unirVentasDeMismaFecha(data,"Ventas",'total');
			let arrayGananciasDia= this.unirVentasDeMismaFecha(data,"Ganancias",'total',true);
			let ventas:number=0;
			let ganancias:number=0;
			for (let i=1;i <arrayVentasDia.length;i++){
				ventas += arrayVentasDia[i][1];
			}
			for (let i=1;i <arrayGananciasDia.length;i++){
				ganancias += arrayGananciasDia[i][1];
			}			
			console.log(ventas.toFixed(2),ganancias.toFixed(2));
			this.todasLasVentasLabelFooter=`Ventas: Q.${ventas.toFixed(2)} Ganancias: Q.${ganancias.toFixed(2)}`;
			 //(Del ${this.initDate.toLocaleDateString()} Al ${this.endDate.toLocaleDateString()} )`
			this.datosChartDos=arrayGananciasDia;
			this.datosChartUno=arrayVentasDia;
			this.actualizarGraficos();
		},
		(err)=>{console.log(err)},
		()=>{
			console.log('busqueda terminada');
			subs.unsubscribe();
		}
		)
	}
/** FIN TODAS LAS VENTAS */
/**ARTICULOS SIN MOVIMIENTO */
	async getArticulosSinVentas(){
		this.arrayDeArticulos=[];
		
		let subsUltimaVenta= await this.data.getItemsEstancados(this.initDate).subscribe(data => {
			this.arrayDeArticulos=this.comun.extraerIdDatosGet(data);
			this.arrayDeArticulos.forEach(articulo=>{
				const fechaUltimaVenta=articulo.ultimaVenta.toDate().toLocaleDateString();
				articulo.ultimaVenta = fechaUltimaVenta;
			})
		},
		(err)=>{console.log(err)},
		()=>{
			subsUltimaVenta.unsubscribe();
		})
		let subsNuncaVendidos=this.data.getItemsSinVentas().subscribe(data => {
			let articulosSinVentas=this.comun.extraerIdDatosGet(data)
			articulosSinVentas.forEach(articulo=>{
				articulo.ultimaVenta = "Sin Ventas";
			})	
			this.arrayDeArticulos =this.arrayDeArticulos.concat(articulosSinVentas);
		},
		(err)=>{console.log(err)},
		()=>{
			subsNuncaVendidos.unsubscribe();
		}
		)
	}
/** FIN ARTICULOS SIN MOVIMIENTO */
/*HISTORIAL */
	unirVentasDeMismaFecha(data,encabezado,keyDatoAUnir:string,ganancias:boolean=false){
		let historialPorDia:any[]=[['Fecha',encabezado]];		
		//fecha anterior que comparara con la fecha del historial actual para saber si son las mismas y guardarlas en una sola
		let fechaAnterior=null;
		let cantidadDia=0;	
		//index para guardar en el array los datos con las mismas fechas
		let idx=1;
		data.forEach(historial=>{										
				const datos=historial.data();
				const fechaCompleta =datos.fecha.toDate();
				console.log(fechaCompleta);
				//extraccion de fecha sin hora
				const fecha=new Date(fechaCompleta.getFullYear() ,fechaCompleta.getMonth(),fechaCompleta.getDate());
				console.log(fecha);
				let costo = ganancias ? datos['costo']:0;
				//si es la primer iteracion la fechaAnterior sera esta misma,se asigna la cantidad de dia actual y se agrega al primer index
				if(fechaAnterior==null){						
					fechaAnterior=fecha;
					cantidadDia= datos[keyDatoAUnir]-costo;
					historialPorDia[idx]=[fecha,cantidadDia];
					//console.log(this.historialArray,"primerdato");
				}else
				{//para las siguientes se compara la fecha anterior en string ya que los objetos son distintos
					if(fechaAnterior.getTime()==fecha.getTime()){
						//si es la misma fecha la cantidad del dia se agrega a la cantidadDia y se reescribe el array en ese mismo index
						cantidadDia+=datos[keyDatoAUnir]-costo;
						historialPorDia[idx]=[fecha,cantidadDia];
					}else{
						//si son distintos corremos el index, seteamos la cantidadDia agregamos los datos al nuevo index y asignamos la fechaAnterior para la siguiente iteracion
						idx++;					
						cantidadDia=datos[keyDatoAUnir]-costo;					
						historialPorDia[idx]=[fecha,cantidadDia]; 									
						fechaAnterior=fecha;
					}
				}
			}
		)
		return historialPorDia;
	}
	agregarHistorialAComarar(historialPorDiaNuevo, nombreArticuloExistente, nombreArticuloNuevo){
		let nuevoArray:any[]=[["Fecha",nombreArticuloExistente,nombreArticuloNuevo]]
		let historialExistente= this.historialesVentas;
		//indices por separado para recorrer el indice
		let indexHistorial =1;
		let indexDatosNueva=1;
		let fin=false;
		let estadoDataNueva:string;
		let estadoDataExistente:string;
		//mientras estadoData o EstadoDataNueva no sean undefined, es decir mientras tengan datos los recorreremos
		while(!fin){
			//toma de fechas de cada historial, al ser un array de array se toma la fecha en la columna 0 del fila index
			let fechaHistorial =historialExistente[indexHistorial][0];
			let fechaNuevaData= historialPorDiaNuevo[indexDatosNueva][0];
			//se agregan al nuevo array los datos dependiendo de las fechas respetando sus columnas de la forma[fecha,historial 1 ,historial 2]
			//y corriendo el index que agregamos
			if(fechaNuevaData.getTime()< fechaHistorial.getTime()){
			//console.log(historialPorDia[indexDatosNueva][1],"nueva");
				nuevoArray.push([fechaNuevaData, null ,historialPorDiaNuevo[indexDatosNueva][1]]);
				indexDatosNueva++;
			}					
			else if(fechaNuevaData.getTime() === fechaHistorial.getTime()){
				//si las fechas son iguales agregamos ambos y corremos ambos index
				nuevoArray.push([fechaNuevaData,historialExistente[indexHistorial][1],historialPorDiaNuevo[indexDatosNueva][1]]);
				indexDatosNueva++;
				indexHistorial++;
			}
			else {
				nuevoArray.push([fechaHistorial,historialExistente[indexHistorial][1],null]);
				indexHistorial++;
			}
			//si alguno de los nuevos index esta indefinido significa que lo desbordamos
			// y salimos del ciclo para agregar el resto del array que aun tenga objecto en su siguiente indice
			estadoDataNueva = typeof historialPorDiaNuevo[indexDatosNueva];
			estadoDataExistente=typeof historialExistente[indexHistorial];
			//console.log(estadoDataExistente, estadoDataNueva,"estados");
			fin =(estadoDataExistente === 'undefined')||(estadoDataNueva === 'undefined');
		}
		if(estadoDataExistente==='object'){
			for(indexHistorial; indexHistorial<historialExistente.length; indexHistorial++){
				nuevoArray.push([historialExistente[indexHistorial][0],historialExistente[indexHistorial][1],null]);
			}
		}
		if(estadoDataNueva==='object'){
			for( indexDatosNueva; indexDatosNueva<historialPorDiaNuevo.length;  indexDatosNueva++){
				nuevoArray.push([historialPorDiaNuevo[ indexDatosNueva][0],null,historialPorDiaNuevo[ indexDatosNueva][1]]);
			}
		}
		return nuevoArray;	
	}
	busquedaHistorial(itemAgregar=this.itemSelected){
		if(itemAgregar!=null){
			if(itemAgregar.id == this.idArticuloEnHistorial){
				this.comun.alerta("Accion No Permitida", "El artículo ya esta en el gráfico");
				return 
			}
			this.idArticuloEnHistorial = itemAgregar.id;
			let historialPorDia=[];
			let subs=this.data.getHistorialItem(this.initDate,this.endDate,itemAgregar.id).subscribe(data=>{
				historialPorDia=this.unirVentasDeMismaFecha(data,this.itemSelected.nombre,'cantidad');
			},
			(err)=>console.log(err),
			()=>{
				this.sinDatosVentas=false;
				
				if (this.historialesVentas.length >1){					
					this.datosChartUno=this.agregarHistorialAComarar(historialPorDia,this.historialesVentas[0][1],this.itemSelected.nombre);
				}else{				
					this.historialesVentas=historialPorDia;
					this.datosChartUno=historialPorDia;
					}
				this.actualizarGraficos();					
				subs.unsubscribe();
				}
			)
		}
	}
	searchCodigo(){
	  this.busquedaCodigo =this.busquedaCodigo.toUpperCase();
	  this.marcaFiltro,this.tipoFiltro = "";
	  this.desubsripcionArticulos.next();
	  this.data.buscarCodigo(this.busquedaCodigo,10).pipe(takeUntil(this.desubsripcionArticulos)).subscribe( changes => {
		  this.articulos= this.comun.extraerIdDatosSnapshot(changes);
	            });
	}
	search(){
		this.busqueda =this.busqueda.toUpperCase();		
		this.desubsripcionArticulos.next();
		this.data.getItems(this.marcaFiltro,this.tipoFiltro	,this.busqueda,10).pipe(takeUntil(this.desubsripcionArticulos)).subscribe( changes => {
			this.articulos= this.comun.extraerIdDatosSnapshot(changes);
			});
	}
	existenArticulos(){
		return this.articulos.length>0;
	  }
	selectItem(item, id ){
  	if (this.rowSelected ){
  		if (this.rowSelected.id === id){
  			this.deSelectRow();
  			this.itemSelected=null;

  		}else{
  			this.deSelectRow();
  			this.selectRow(id);
  			this.itemSelected=item;	
  		}
  	}else{
  		this.selectRow(id);
  		this.itemSelected=item;
  	}
	}
	selectRow(id){
	this.rowSelected = document.getElementById(id);
	this.rowSelected.classList.add("selected");
	}
	deSelectRow(){
		if (this.rowSelected ){
			this.rowSelected.classList.remove("selected");
			this.rowSelected=null;}
	}
	limpiarHistorial(){
		this.datosChartUno=[];
		this.historialesVentas=[];
		this.itemSelected=null;
		this.actualizarGraficos();
	}
/*  FIN HISTORIAL */
	actualizarGraficos(){
		if(this.ventanaActual){			 
			this.sinDatosVentas=(this.datosChartUno.length<=1) ?true:false;
				let dataChart1=[];
				let dataChart2=[]
				if(this.opcionElegida=="Artículos Más Productivos"){
					 dataChart1 = this.datosChartUno.length > this.limiteDatos? this.datosChartUno.slice(0,this.limiteDatos) : this.datosChartUno;
					 dataChart2 = this.datosChartDos.length > this.limiteDatos? this.datosChartDos.slice(0,this.limiteDatos) : this.datosChartDos;
					}
				else { 
					dataChart1=this.datosChartUno;
					dataChart2=this.datosChartDos;
				}
				this.chartUno = {
					chartType: this.tipoDeChart,
					dataTable: dataChart1,					
					options:this.opcionesChart1,
					}	
				this.chartUno.options['animation']={	duration: 500,easing: 'out',}			
				this.chartDos = {
					chartType: this.tipoDeChart,
					dataTable: dataChart2,
					options:this.opcionesChart2,
				}
				this.chartDos.options['animation']={	duration: 500,easing: 'out',}			
		}		
	}
}


/** OPCIONES DE GRAFICOS
 * 					options: {
					'width':'320%',
					'height':'100%',
					'legend':'left',
					'title':'Los Más Vendidos',
					'sliceVisibilityThreshold': this.sensibilidadPieChart,
					'pieSliceText': 'value',
					'pieResidueSliceLabel':'Otros Productos',
					animation:{
					duration: 500,
					easing: 'out',
					},
					backgroundColor: '#edffed',
					legend: { position: 'none'}
					chartArea: { width: '300%', height: '220%', left: 0, top: 0 },
					legend: { position: 'bottom', maxLines: 10, textStyle: { fontSize: 12, bold: true, italic: false } }
					}
 */