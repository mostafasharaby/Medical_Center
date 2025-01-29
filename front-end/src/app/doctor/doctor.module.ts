import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorComponent } from './doctor.component';
import { AuthModule } from '../pages/auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RelatedAppointmentsComponent } from './pages/related-appointments/related-appointments.component';
import { AdminModule } from '../admin/admin/admin.module';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { PatientReviewsComponent } from './pages/patient-reviews/patient-reviews.component';
import { GeneralModule } from '../pages/general/general.module';

const routes: Routes = [
  { path: 'doctor-appointments', component: RelatedAppointmentsComponent },
  { path: 'doctor-profile', component: DoctorProfileComponent },
  { path: 'patient-reviews', component: PatientReviewsComponent },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    RouterModule,
    FormsModule ,
    AuthModule ,
    AdminModule,
    GeneralModule

  ],
  declarations: [
    DoctorComponent,
    RelatedAppointmentsComponent,
    DoctorProfileComponent,
    PatientReviewsComponent,
    
  ]

})
export class DoctorModule { }
