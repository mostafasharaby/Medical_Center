import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general.component';
import { HomeComponent } from './Home/Home.component';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { BlogComponent } from './blog/blog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestAppointmentComponent } from './request-appointment/request-appointment.component';
import { MedicalServiceComponent } from './medical-service/medical-service.component';
import { GalleryComponent } from './gallery/gallery.component';
import { TeamComponent } from './team/team.component';
import { FaqComponent } from './faq/faq.component';
import { AppointmentRequestComponent } from './appointment-request/appointment-request.component';
import { DoctorcsComponent } from './doctorcs/doctorcs.component';
import { DeleteModalComponent } from '../../doctor/pages/delete-modal/delete-modal.component';
import { CollectedShotsComponent } from './collected-shots/collected-shots.component';


const routes: Routes = [

  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'appointment', component: RequestAppointmentComponent },
  { path: 'service', component: MedicalServiceComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'team', component: TeamComponent },
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
    GeneralComponent,HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    BlogComponent,
    UserProfileComponent,
    RequestAppointmentComponent,
    MedicalServiceComponent,
    GalleryComponent,
    CollectedShotsComponent,
    TeamComponent,
    DoctorcsComponent,
    FaqComponent,
    AppointmentRequestComponent,
    DeleteModalComponent
  ],
  exports: [DeleteModalComponent]
})
export class GeneralModule { }
