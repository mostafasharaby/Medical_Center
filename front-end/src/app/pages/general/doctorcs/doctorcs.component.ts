import { Component, OnInit, OnDestroy } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../../models/doctor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctorcs',
  templateUrl: './doctorcs.component.html',
  styleUrls: ['./doctorcs.component.css']
})
export class DoctorcsComponent implements OnInit, OnDestroy {
  
  doctorsData: Doctor[] = [];
  private doctorSubscription!: Subscription;

  constructor(private doctorService: DoctorService) { }

  ngOnInit() {
    this.loadDoctor();
  }
  ngOnDestroy() {
    if (this.doctorSubscription) {
      this.doctorSubscription.unsubscribe();
      console.log('Doctor subscription unsubscribed.');
    }
  }
  loadDoctor() {
    this.doctorSubscription = this.doctorService.getAllDoctors().subscribe(
      (doctorFetched: Doctor[]) => {
        if (doctorFetched) {
          this.doctorsData = doctorFetched;
          console.log('Fetched doctorsData :', this.doctorsData, this.doctorsData.length);
        } else {
          console.log('No doctorsData');
        }
      },
      (error) => {
        console.error('Error fetching doctorsData :', error);
      }
    );
  }

 
}
