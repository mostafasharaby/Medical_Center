import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { BoardComponent } from './pages/board/board.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { SideBarComponent } from './pages/side-bar/side-bar.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { TempAppointmentComponent } from './pages/temp-appointment/temp-appointment.component';
import { ChartComponent } from './pages/chart/chart.component';
import { AuthModule } from '../pages/auth/auth.module';
import { GeneralModule } from '../pages/general/general.module';

const routes: Routes = [
  { path: 'doctors', component: DoctorsComponent },
  { path: 'dashboard', component: BoardComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'side', component: SideBarComponent },
  { path: 'appointments', component: AppointmentsComponent }

]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    AuthModule,
    GeneralModule
  ],
  declarations: [
    AdminComponent,
    DoctorsComponent,
    BoardComponent,
    ChartComponent,
    PatientsComponent,
    SideBarComponent,
    AppointmentsComponent,
    TempAppointmentComponent

  ],
  exports: [SideBarComponent],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
