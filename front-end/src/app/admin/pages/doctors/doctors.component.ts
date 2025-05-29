import { Component, OnDestroy, OnInit } from '@angular/core';
import { Doctor } from '../../../pages/models/doctor';
import { DoctorService } from '../../../pages/general/services/doctor.service';
import { ReloadService } from '../../../shared/service/reload.service';
import { Subscription } from 'rxjs';
import { MENU } from '../../menu';
import { AppointmentService } from '../../../pages/general/services/appointment.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html'
})
export class DoctorsComponent implements OnInit, OnDestroy {

  doctorsData: Doctor[] = [];
  doctorSubscription !: Subscription;
  menuItems = MENU;
  numOfAppointments: number = 0;
  constructor(private doctorService: DoctorService, private reload: ReloadService , 
    private appointmentService: AppointmentService) { }

  ngOnDestroy(): void {
    if (this.doctorSubscription) {
      this.doctorSubscription.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  ngOnInit(): void {
    this.loadDoctor();
    this.setBadgeForAppointments();
    this.loadAppointments();
  }
  setBadgeForAppointments() {
    const appointmentItem = this.menuItems.find(item => item.title === 'Appointment');
    if (appointmentItem) {
      appointmentItem.badge = this.numOfAppointments.toString();
      console.log('Appointment badge set to:', appointmentItem.badge);
    }
  }
  loadDoctor(): void {
    this.doctorSubscription = this.doctorService.getAllDoctors().subscribe(
      (doctorFetched: Doctor[]) => {
        if (doctorFetched) {
          this.doctorsData = doctorFetched;
          console.log('Fetched doctorsData :', this.doctorsData, this.doctorsData.length);
        } else {
          console.log('No  doctorsData');
        }
      },
      (error) => {
        console.error('Error fetching doctorsData :', error);
      }
    );
  }
  loadAppointments(): void {
    const appointmentSub = this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.numOfAppointments = data.length;
        this.setBadgeForAppointments();
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
}
