
export class campoBase<A> {
    /**
      * obligatorios
      *    tipo de campo:
      *     'textbox', 'select'
      * 
      */
  valor: A;
  nombreCampo: string;
  tipoDeCampo: string;
  tipoDeDato:string;
  etiqueta:string;
  posicionEtiqueta:string;
  minCaracteres:number;
  maxCaracteres:number;
  requerido: boolean;
  patronRequerido:boolean  
  etiquetaErrRequerido: string;
  patronRequeridoString:string;
  etiquetaErrPatron:string;
  claseCss:string;
  placeholder:string;
  opciones:string[];
  steps:number;//steps de cambio en campos numericos
  selectInterfaz:string;
  disabled:boolean;
  constructor(opciones: {
      valor?: A,
      nombreCampo?: string,
      requerido?: boolean,      
      etiquetaErrRequerido?: string,
      patronRequerido?:boolean,
      patronRequeridoString?:string,
      etiquetaErrPatron?:string,
      tipoDeDato?:string,
      tipoDeCampo?:string,
      claseCss?:string
      posicionEtiqueta?:string,
      etiqueta?:string,
      minCaracteres?:number,
      maxCaracteres?:number,
      placeholder?:string,
      opciones?:string[],
      steps?:number,
      selectInterfaz?:string,
      disabled?:boolean,
    } = {}) {
    this.valor = opciones.valor;
    this.nombreCampo = opciones.nombreCampo || '';
    this.etiquetaErrRequerido = opciones.etiquetaErrRequerido || '';
    this.requerido = !!opciones.requerido;
    this.patronRequerido=!!opciones.patronRequerido;
    this.patronRequeridoString=opciones.patronRequeridoString ||'';
    this.etiquetaErrPatron= opciones.etiquetaErrPatron||'';
    this.tipoDeCampo = opciones.tipoDeCampo||'textbox';
    this.tipoDeDato = opciones.tipoDeDato||'text';
    this.claseCss = opciones.claseCss ||'campoTexto';
    this.posicionEtiqueta= opciones.posicionEtiqueta || 'floating';
    this.etiqueta = opciones.etiqueta || '';
    this.minCaracteres = opciones.minCaracteres || (this.requerido? 5:0);
    this.maxCaracteres = opciones.maxCaracteres || 50;
    this.placeholder = opciones.placeholder || '';
    this.opciones = opciones.opciones || [];
    this.steps=opciones.steps||1;
    this.selectInterfaz=opciones.selectInterfaz || 'action-sheet';
    this.disabled = !!opciones.disabled;
  }
}
