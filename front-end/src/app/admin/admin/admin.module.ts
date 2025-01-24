import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { BoardComponent } from './pages/board/board.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { PatientsComponent } from './pages/patients/patients.component';

const routes: Routes = [
  { path: 'doctors', component: DoctorsComponent },
  { path: 'dashboard', component: BoardComponent },
  { path: 'chart', component: ChartsComponent },
  { path: 'patients', component: PatientsComponent }

]
@NgModule({
  imports: [
    CommonModule,
       RouterModule.forChild(routes),
       ReactiveFormsModule,
       RouterModule,
       FormsModule 
  ],
  declarations: [
    AdminComponent,
    DoctorsComponent,
    BoardComponent,
    ChartsComponent,
    PatientsComponent
    
  ],
  bootstrap: [AdminComponent] 
})
export class AdminModule { }
