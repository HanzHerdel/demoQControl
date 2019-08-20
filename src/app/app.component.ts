import { Component, enableProdMode } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


enableProdMode();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  public appPages = [
    {titulo: 'Ventas',url: '/ventas',icon: 'cart',class:"ventas"},
    {titulo: 'Reportes',url: '/reportes',icon: 'paper',class:"reportes"},
    {titulo: 'Agregar Datos',url: '/agregar',icon: "clipboard",class:"agregar"},
    {titulo: 'Editar Datos',url: '/edicion',icon: 'create',class:"editar"},
    {titulo: 'Inventario',url: '/inventario',icon: 'folder-open',class:"inventario"},
    {titulo: 'Gráficas', url:'/graficas',icon:'analytics', class:"graficas"},
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
