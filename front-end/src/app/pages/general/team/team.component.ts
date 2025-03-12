import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../../models/doctor';
import { ReloadService } from '../../../shared/service/reload.service';
import { TEAM_TABS } from '../../models/teamTabs ';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})

export class TeamComponent implements OnInit, OnDestroy {

  doctorsData: Doctor [] =[];
  private subscriptions: Subscription[] = [];
  
  constructor(private doctorService:DoctorService , private reload :ReloadService) { }


  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  ngOnInit() {
    this.loadDoctor();          
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  loadDoctor() {
    const doctorSub =  this.doctorService.getAllDoctors().subscribe(
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
    this.subscriptions.push(doctorSub);
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
