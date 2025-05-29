import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { ReloadService } from '../../../shared/service/reload.service';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../../pages/general/services/appointment.service';
import { MENU } from '../../menu';
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html'
})
export class PatientsComponent implements OnInit , OnDestroy{

  patientData: any[] = [];
  menuItems = MENU;
  isLoading: boolean = true;
  numOfAppointments: number = 0;
  errorMessage: string = '';
  patientSubscription !: Subscription;

  constructor(private patientService: PatientService , private reload :ReloadService ,
    private appointmentService : AppointmentService
  ) {}
  ngOnDestroy(): void {
   if(this.patientService){
      this.patientSubscription.unsubscribe();
   }
  }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  ngOnInit(): void {
    this.fetchPatientReviews();
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

  fetchPatientReviews(): void {
   this.patientSubscription= this.patientService.getAllPatient().subscribe({
      next: (data) => {
        this.patientData = data;
        console.log("Patient retrieved successfully ", this.patientData)
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch patient reviews.';
        console.error(error);
      }
    });
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
