import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppointmentService } from '../../../pages/general/services/appointment.service';
import { ReloadService } from '../../../shared/service/reload.service';
import { Subscription } from 'rxjs';
import { MENU } from '../../menu';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  appointments: any[] = [];
  numOfAppointments: number = 0;
  menuItems = MENU;
  appointmentsSubscription!: Subscription;
  constructor(private appointmentService: AppointmentService, private reload: ReloadService) { }
  ngOnDestroy(): void {
    if (this.appointmentsSubscription) {
      this.appointmentsSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentsSubscription = this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data;
        this.numOfAppointments = this.appointments.length;
        console.log('Fetched appointments:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }

  setBadgeForAppointments() {
    const appointmentItem = this.menuItems.find(item => item.title === 'Appointment');
    if (appointmentItem) {
      appointmentItem.badge = this.numOfAppointments.toString();
      console.log('Appointment badge set to:', appointmentItem.badge);
    }
  }


}
