import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../../pages/general/services/doctor.service';
import { Doctor } from '../../../../pages/models/doctor';
import { AppointmentService } from '../../../../pages/general/services/appointment.service';
import { MENU } from '../../menu';
import { ReloadService } from '../../../../shared/service/reload.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  appointments: any[] = [];
  infoBoxes:any[]=[];
  doctorsData: Doctor[] = [];
  numOfAppointments: number = 0;
  numOfDoctors: number = 0;
  menuItems = MENU;
  constructor(private appointmentService: AppointmentService, private doctorService: DoctorService , private reload :ReloadService) { }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctor();
    this.optimizeWidget();
    this.setBadgeForAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data;
        this.numOfAppointments = this.appointments.length;
        this.optimizeWidget();
        this.setBadgeForAppointments();
        console.log('Fetched appointments:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }

  loadDoctor(): void {
    this.doctorService.getAllDoctors().subscribe(
      (doctorFetched: Doctor[]) => {
        if (doctorFetched) {
          this.doctorsData = doctorFetched;
          this.numOfDoctors = this.doctorsData.length;
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

  setBadgeForAppointments() {
    const appointmentItem = this.menuItems.find(item => item.title === 'Appointment');
    if (appointmentItem) {
      appointmentItem.badge = this.numOfAppointments.toString();
    }
  }
 
optimizeWidget(): void{  
  this.infoBoxes = [
    {
      bgClass: 'bg-blue',
      iconClass: 'fas fa-users',
      text: 'Appointments',
      number: this.numOfAppointments,
      progress: 45,
      description: '45% Increase in 28 Days',
    },
    {
      bgClass: 'bg-orange',
      iconClass: 'fas fa-user',
      text: 'New Patients',
      number: 155,
      progress: 40,
      description: '40% Increase in 28 Days',
    },
    {
      bgClass: 'bg-purple',
      iconClass: 'fas fa-syringe',
      text: 'Operations',
      number: 52,
      progress: 85,
      description: '85% Increase in 28 Days',
    },
    {
      bgClass: 'bg-success',
      iconClass: 'fas fa-dollar-sign',
      text: 'Hospital Earning',
      number: '13,921$',
      progress: 50,
      description: '50% Increase in 28 Days',
    },
  ];
}

}
