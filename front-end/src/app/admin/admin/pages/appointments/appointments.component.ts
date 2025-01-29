import { Component, OnInit } from '@angular/core';
import { ReloadService } from '../../../../shared/service/reload.service';
import { AppointmentService } from '../../../../pages/general/services/appointment.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];  
  numOfAppointments: number = 0;

  constructor(private appointmentService: AppointmentService , private reload :ReloadService) { }

  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  
  ngOnInit(): void {
    this.loadAppointments();   
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
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

 


   
}
