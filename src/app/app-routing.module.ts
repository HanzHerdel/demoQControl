import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',redirectTo: 'ventas', pathMatch: 'full'
  },
  {
    path: 'ventas', loadChildren: './pages/ventas/ventas.module#VentasPageModule'
  },
  {
    path: 'agregar', loadChildren: './pages/agregar/agregar.module#AgregarPageModule'
  },
  { 
    path: 'edicion', loadChildren: './pages/edicion/edicion.module#EdicionPageModule' 
  },
  { path: 'reportes', loadChildren: './pages/reportes/reportes.module#ReportesPageModule' },
  { path: 'graficas', loadChildren: './pages/graficas/graficas.module#GraficasPageModule' },
  { path: 'inventario', loadChildren: './pages/inventario/inventario.module#InventarioPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
