import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../../../pages/models/doctor';
import { DoctorService } from '../../../../pages/general/services/doctor.service';
import { ReloadService } from '../../../../shared/service/reload.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {

  doctorsData: Doctor[] = [];
  constructor( private doctorService: DoctorService , private reload:ReloadService) { }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
    ngOnInit(): void {    
      this.loadDoctor();     
    }  
  
    loadDoctor(): void {
      this.doctorService.getAllDoctors().subscribe(
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
