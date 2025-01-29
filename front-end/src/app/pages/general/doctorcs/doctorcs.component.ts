import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-doctorcs',
  templateUrl: './doctorcs.component.html',
  styleUrls: ['./doctorcs.component.css']
})
export class DoctorcsComponent implements OnInit {

  constructor(private doctorService :DoctorService) { }
  doctorsData: Doctor [] =[];
   ngOnInit() {
      //this.cartSubscription =
      this.loadDoctor();
    }
    loadDoctor() {
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
