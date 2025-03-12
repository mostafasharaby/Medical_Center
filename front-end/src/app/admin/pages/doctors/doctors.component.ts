import { Component, OnDestroy, OnInit } from '@angular/core';
import { Doctor } from '../../../pages/models/doctor';
import { DoctorService } from '../../../pages/general/services/doctor.service';
import { ReloadService } from '../../../shared/service/reload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html'
})
export class DoctorsComponent implements OnInit, OnDestroy {

  doctorsData: Doctor[] = [];
  doctorSubscription !: Subscription;
  constructor(private doctorService: DoctorService, private reload: ReloadService) { }
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

}
