import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/general/Home/Home.component';
import { ErrorPageComponent } from './pages/general/errorPage/errorPage.component';
import { DoctorGuard } from './doctor/guard/doctor.guard';
import { AdminGuard } from './admin/guard/admin.guard';
import { AuthGuard } from './pages/auth/guard/auth.guard';


const routes: Routes = [
  {
    path: '',component: HomeComponent,  pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent , canActivate:[AuthGuard] // title: 'resolvedChildATitle'
  },
  { 
    path: 'admin', canActivate: [AdminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {  
    path: 'doctor',canActivate: [DoctorGuard],
    loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/general/general.module').then(m => m.GeneralModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'error', component: ErrorPageComponent,
    data: {
      type: 404,
      title: 'Page Not Found',
      desc: "Oopps!! The page you were looking for doesn't exist.",
    },
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent,
  },
  {
    path: '**', redirectTo: 'error', pathMatch: 'full'
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
