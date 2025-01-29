import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../pages/auth/auth-services/auth-service.service';
import { DoctorService } from '../../../pages/general/services/doctor.service';
import { DoctorAppointmentsService } from '../../services/doctor-appointments.service';
import { ReloadService } from '../../../shared/service/reload.service';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {

  constructor(private authService :AuthServiceService , private doctorService:DoctorAppointmentsService , private reload:ReloadService) { }

  doctorId: string = '';
  errorMessage: string = '';
  profile :any=null;
  ngOnInit(): void {
    this.setDoctorId();  
    this.getDoctor();

  }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
    //this.loadFlowbite();
  }


  setDoctorId(): void {
    const id = this.authService.getNameIdentifier();
    if (id) {
      this.doctorId = id;
    } else {
      this.errorMessage = 'Failed to fetch doctor ID. Please log in again.';
      console.error(this.errorMessage);
    }
  }
  
  getDoctor(): void {
    this.doctorService.getSpecialDoctor(this.doctorId).subscribe({
      next: (data) => {
        this.profile = data;
        console.log("profile", this.profile);
      },
      error: (error) => {  
        console.error(error);
      },
    });
  }

}
