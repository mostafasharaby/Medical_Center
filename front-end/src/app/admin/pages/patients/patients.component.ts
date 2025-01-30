import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { ReloadService } from '../../../shared/service/reload.service';
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html'
})
export class PatientsComponent implements OnInit {

  patientData: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private patientService: PatientService , private reload :ReloadService) {}
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  ngOnInit(): void {
    this.fetchPatientReviews();
  }

  fetchPatientReviews(): void {
    this.patientService.getPatientReviews().subscribe({
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
