import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../../models/doctor';
import { ReloadService } from '../../../shared/service/reload.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor(private doctorService:DoctorService , private reload :ReloadService) { }
  doctorsData: Doctor [] =[];


  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  ngOnInit() {
    //this.cartSubscription =
    this.doctorService.getAllDoctors().subscribe(
      (doctorFetched: Doctor[]) => {
        if (doctorFetched) {
          this.doctorsData = doctorFetched;
          console.log('Fetched doctorsData :',this.doctorsData , this.doctorsData.length);
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
