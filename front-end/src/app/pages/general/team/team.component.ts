import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../../models/doctor';
import { ReloadService } from '../../../shared/service/reload.service';
import { TEAM_TABS } from '../../models/teamTabs ';

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

  teamTabs = [
    {
      id: 'doctor',
      members: [
        {
          name: 'Dr. Sheiring Ton',
          role: 'Manager',
          image: 'images/team/event-1.jpg'
        },
        {
          name: 'Dr. Rig Richard',
          role: 'Sr. Manager',
          image: 'images/team/event-2.jpg'
        },
        {
          name: 'Dr. Tom Moddy',
          role: 'President',
          image: 'images/team/event-3.jpg'
        }
      ]
    },
    {
      id: 'event-planning',
      members: [
        {
          name: 'Dr. Maria Robert',
          role: 'X-ray',
          image: 'images/team/doctor-lab-1.jpg'
        },
        {
          name: 'Dr. John Kelly',
          role: 'Ultrasound Therapy',
          image: 'images/team/doctor-lab-2.jpg'
        },
        {
          name: 'Dr. Simran Toe',
          role: 'Bone Therapy',
          image: 'images/team/doctor-lab-3.jpg'
        }
      ]
    },
    {
      id: 'lab',
      members: [
        {
          name: 'Dr. Rag Jhon',
          role: 'Eye Specialist',
          image: 'images/team/doctor-2.jpg'
        },
        {
          name: 'Dr. John Kelly',
          role: 'Ultrasound Therapy',
          image: 'images/team/doctor-lab-2.jpg'
        },
        {
          name: 'Dr. Sheiring Ton',
          role: 'Manager',
          image: 'images/team/event-1.jpg'
        }
      ]
    },
    {
      id: 'marketing',
      members: [
        {
          name: 'Dr. Rag Jhon',
          role: 'Eye Specialist',
          image: 'images/team/doctor-2.jpg'
        },
        {
          name: 'Dr. John Kelly',
          role: 'Ultrasound Therapy',
          image: 'images/team/doctor-lab-2.jpg'
        },
        {
          name: 'Dr. Sheiring Ton',
          role: 'Manager',
          image: 'images/team/event-1.jpg'
        }
      ]
    }
  ];
}
