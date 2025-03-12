import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../pages/auth/auth-services/auth-service.service';
import { DoctorAppointmentsService } from '../../services/doctor-appointments.service';
import { ReloadService } from '../../../shared/service/reload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html'
})
export class DoctorProfileComponent implements OnInit, OnDestroy {

  doctorSubscription !: Subscription;
  constructor(private authService: AuthServiceService, private doctorService: DoctorAppointmentsService, private reload: ReloadService) { }
  ngOnDestroy(): void {
    if (this.doctorSubscription) {
      this.doctorSubscription.unsubscribe();
    }
  }

  doctorId: string = '';
  errorMessage: string = '';
  profile: any = null;
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
    this.doctorSubscription = this.doctorService.getSpecialDoctor(this.doctorId).subscribe({
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
