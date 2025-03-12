import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { ReloadService } from '../../../shared/service/reload.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html'
})
export class PatientsComponent implements OnInit , OnDestroy{

  patientData: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  patientSubscription !: Subscription;

  constructor(private patientService: PatientService , private reload :ReloadService) {}
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

}
