import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../pages/general/services/appointment.service';
import { ReloadService } from '../../../shared/service/reload.service';

@Component({
  selector: 'app-temp-appointment',
  templateUrl: './temp-appointment.component.html'
})
export class TempAppointmentComponent implements OnInit {

 appointments: any[] = [];  
   numOfAppointments: number = 0;
 
   constructor(private appointmentService: AppointmentService , private reload :ReloadService) { }
 
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
