import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorComponent } from './doctor.component';
import { AuthModule } from '../pages/auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RelatedAppointmentsComponent } from './pages/related-appointments/related-appointments.component';
import { AdminModule } from '../admin/admin/admin.module';

const routes: Routes = [
  { path: 'doctor-appointments', component: RelatedAppointmentsComponent },
 
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    RouterModule,
    FormsModule ,
    AuthModule,
    AdminModule

  ],
  declarations: [
    DoctorComponent,
    RelatedAppointmentsComponent
  ]
})
export class DoctorModule { }
