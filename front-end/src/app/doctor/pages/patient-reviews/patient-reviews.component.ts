import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReloadService } from '../../../shared/service/reload.service';
import { AuthServiceService } from '../../../pages/auth/auth-services/auth-service.service';
import { RelatedPatientsReviewsService } from '../../services/related-patients-reviews.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-reviews',
  templateUrl: './patient-reviews.component.html'
})
export class PatientReviewsComponent implements OnInit, OnDestroy {

  patientReviewsSubscribtion !: Subscription;
  constructor(private reload: ReloadService, private patientsReviewService: RelatedPatientsReviewsService, private authService: AuthServiceService) { }
  ngOnDestroy(): void {
    if (this.patientReviewsSubscribtion) {
      this.patientReviewsSubscribtion.unsubscribe();
    }
  }

  ngOnInit() {
    this.setDoctorId();
    this.getPatientsReview();
  }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }

  doctorId: string = '';
  errorMessage: string = '';
  reviews: any[] = [];
  setDoctorId(): void {
    const id = this.authService.getNameIdentifier();
    console.log("id", id);
    if (id) {
      this.doctorId = id;
    } else {
      console.log("Please enter adoctorId ")
      console.error(this.errorMessage);
    }
  }

  getPatientsReview(): void {
    if (this.doctorId == null) {
      console.error(this.errorMessage);
    }
    this.patientReviewsSubscribtion = this.patientsReviewService.getPatientsReview(this.doctorId).subscribe({
      next: (data) => {
        this.reviews = data;
        console.log("reviews", this.reviews);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
