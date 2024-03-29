// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export interface opcionesCampo{

}
export const environment = {
  production: true,

  firebase:  {
    apiKey: "AIzaSyDX8w7z_R4se9pwNO1kvp_kjmvB9iSwkfE",
    authDomain: "demoutz-217701.firebaseapp.com",
    databaseURL: "https://demoutz-217701.firebaseio.com",
    projectId: "demoutz-217701",
    storageBucket: "demoutz-217701.appspot.com",
    messagingSenderId: "81462899360",
    appId: "1:81462899360:web:9628a82f353f4d63"
  },
  //CAMPOS ITEMS
  camposItems:[
   {  nombreCampo: 'nombre', etiqueta:'Nombre',
      etiquetaErrRequerido: 'El nombre es obligatorio',requerido:true,
      minCaracteres:4},   {
      nombreCampo: 'codigo',etiqueta:'Código',
      etiquetaErrRequerido: 'Sin código resulta mas difícil encontrar productos, esta casilla es compatible y automática con lectores de código de barra',
      requerido:true,minCaracteres:4},
   {  nombreCampo: 'marca',etiqueta:'Marca',minCaracteres:3,
      etiquetaErrRequerido: 'Marca Requerida',requerido:true,
      tipoDeCampo:'select',opciones:[], 
      claseCss:"campoSelec", placeholder:"Seleccione de la lista",   },
   {   nombreCampo: 'proveedor',etiqueta:'Proveedor',
      tipoDeCampo:'select',opciones:[], 
      claseCss:"campoSelec", placeholder:"Seleccione de la lista",
      requerido:true,etiquetaErrRequerido:"este dato te ayudara a filtrar los artículos de este proveedor"    },
   {nombreCampo: 'tipo',etiqueta:'Categoría', 
      tipoDeCampo:'select',opciones:[], placeholder:"Seleccione de la lista", selectInterfaz:"action-sheet", claseCss:"campoSelec",
      etiquetaErrRequerido:'La categoría de producto servira para filtrar y crear gráficas sobre categoria de productos', requerido:true},
   { nombreCampo: 'existencias',etiqueta:'Existencias',
      tipoDeDato:'number',
      etiquetaErrRequerido:"Las unidades del producto son obligatorias",
      valor:"1",requerido:true,claseCss:'campoNum',},
   { nombreCampo: 'limite',etiqueta:'Límite de Unidades',
      tipoDeDato:'number',
      requerido:true,etiquetaErrRequerido: 'Asigna limite para saber cuando necesitas mas unidades',
      claseCss:'campoNumLimite',   },
   {  nombreCampo: 'costo',etiqueta:'Costo',
      tipoDeDato:'number',
      etiquetaErrRequerido:"El costo es útil para revisar las ganancias generadas por los productos y para la generacion de gráficas",
      requerido:true,claseCss:'campoNum',steps:10,  },
   {  nombreCampo: 'precio',etiqueta:'Precio',
      requerido:true,etiquetaErrRequerido: 'El precio es obligatorio',
      tipoDeDato:'number',steps:10,
      claseCss:'campoNum', },
  ],
  // FIN CAMPOS ITEMS
  // CAMPOS CATEGORIAS
  camposTipos:[
    {nombreCampo:'nombre',etiqueta:'Nombre de Categoria',minCaracteres:4,
      etiquetaErrRequerido:'La categoria necesita un nombre', requerido:true,},
    {nombreCampo:'descripcion', etiqueta:'Descripción',maxCaracteres:100, claseCss:"campoTextoExtendido"}
  ],
  // FIN CAMPOS CATEGORIAS
  /// CAMPOS PROVEEDOR
  camposProveedor:[    
    { nombreCampo:"nombre",etiqueta:"Nombre", 
    etiquetaErrRequerido:"El Nombre del Proveedor es requerido", requerido:true,
    claseCss:"campoTextoExtendido", maxCaracteres:100, minCaracteres:4},
    { nombreCampo:"tel",etiqueta:"Teléfono",
      etiquetaErrRequerido:"El contacto queriere un telefono", requerido:true,
      minCaracteres:7, maxCaracteres:20,  },
    {nombreCampo:"empresa",etiqueta:"Empresa",
      minCaracteres:7, maxCaracteres:25,},
    {nombreCampo:"email",etiqueta:"Correo Electrónico",
      tipoDeDato:"email", },     
    {nombreCampo:"dir",etiqueta:"Dirección", claseCss:"campoTextoExtendido",},
    {nombreCampo:"notas",etiqueta:"Notas",claseCss:"campoTextoExtendido",},   
  ],
  // FIN CAMPOS PROVEEDOR
  // CAMPOS MARCAS
  camposMarcas:[
    {nombreCampo:'nombre',etiqueta:'Nombre de Marca',minCaracteres:4,
    etiquetaErrRequerido:'La marca necesita un nombre', requerido:true,},
    {nombreCampo:'descripcion', etiqueta:'Descripción',maxCaracteres:100,claseCss:"campoTextoExtendido"},
    {nombreCampo:'representante', etiqueta:'Nombre Del Representante'},
    {nombreCampo:'contacto', etiqueta:'Contacto'},
    {nombreCampo:'notas', etiqueta:'Notas',maxCaracteres:100,claseCss:"campoTextoExtendido"},
  ],
  // FIN CAMPOS MARCAS
  // CAMPOS CLIENTE
  camposCliente:[    
    { nombreCampo:"nombre",etiqueta:"Nombre", 
    etiquetaErrRequerido:"El Nombre del Cliente es Requerido", requerido:true,
    claseCss:"campoTextoExtendido", maxCaracteres:100, },
    { nombreCampo:"tel",etiqueta:"Teléfono",
      etiquetaErrRequerido:"El contacto queriere un telefono", requerido:true,
      minCaracteres:8, maxCaracteres:8,  },
    {nombreCampo:"nit",etiqueta:"Nit",
      minCaracteres:3, maxCaracteres:9,requerido:true, etiquetaErrRequerido:"El nit es obligatorio",
      patronRequerido:true,patronRequeridoString:"[A-Za-z0-9 -]+",etiquetaErrPatron:"El Nit solo puede contener números, letras y guiones",
    },
    {nombreCampo:"email",etiqueta:"Correo Electrónico",tipoDeDato:"email",},     
    {nombreCampo:"dir",etiqueta:"Dirección", claseCss:"campoTextoExtendido",},
    {nombreCampo:"notas",etiqueta:"Notas",claseCss:"campoTextoExtendido",},   
  ],
  camposUsuario:[    
    { nombreCampo:"nombre",etiqueta:"Nombre", 
    etiquetaErrRequerido:"El nombre del usuario es requerido", requerido:true,
    claseCss:"campoTextoExtendido", maxCaracteres:100, },
    { nombreCampo:"usuario",etiqueta:"Usuario", 
    etiquetaErrRequerido:"Se requiere un usuario para acceder al sitio", requerido:true,
    claseCss:"campoTextoExtendido"  },
    { nombreCampo:"password",etiqueta:"Contraseña", 
    etiquetaErrRequerido:"Se requiere una contraseña para acceder al sitio", requerido:true,
    claseCss:"campoTextoExtendido" },
    { nombreCampo:"tel",etiqueta:"Teléfono",
      etiquetaErrRequerido:"El usuario queriere un telefono", requerido:true,
      minCaracteres:8, maxCaracteres:8,  },
    {nombreCampo:"email",etiqueta:"Correo Electrónico",tipoDeDato:"email",requerido:true,},     
    {nombreCampo:"dir",etiqueta:"Dirección", claseCss:"campoTextoExtendido",},
    {nombreCampo:"notas",etiqueta:"Notas",claseCss:"campoTexto-X",},   
    
  ],
  // FIN CAMPOS CLIENTE
  // CAMPOS GASTOS
  camposGastos:[    
    { nombreCampo:"concepto",etiqueta:"Concepto", 
    etiquetaErrRequerido:"El concepto del gasto es requerido", requerido:true,
    claseCss:"campoTextoExtendido", maxCaracteres:100, },
    {  nombreCampo: 'cantidad',etiqueta:'Cantidad',
    requerido:true,etiquetaErrRequerido: 'La cantidad es requerida',
    tipoDeDato:'number',steps:10,
    claseCss:'campoNum' },   
    {nombreCampo:"notas",etiqueta:"Notas",claseCss:"campoTextoExtendido", maxCaracteres:150,tipoDeCampo:"textarea"},
  ],
  // FIN CAMPOS GASTOS
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
