import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReloadService } from '../../../shared/service/reload.service';
import { PatientReviewService } from '../services/patient-review.service';
import { SpecializationService } from '../services/specialization.service';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements  OnInit , AfterViewInit {

  constructor(private reload : ReloadService , 
              private patientReviewService: PatientReviewService,
              private specializationService :SpecializationService) { }

  reviews: any[] = []; 
  specializations: any[] = [];

  ngAfterViewInit(): void {   
    this.reload.initializeLoader();
  }

  ngOnInit(): void {
    this.patientReviewService.getPatientReviews().subscribe(data => {
      this.reviews = data.slice(1, 3);
      console.log("reviews ",this.reviews);
    });

    this.specializationService.getSpecializations().subscribe(
      (data) => {
        this.specializations = data.slice(0,6);
        console.log("specializations ",this.specializations);
      },
      (error) => {
        console.error('Error fetching specializations', error);
      }
    );

  }

}
