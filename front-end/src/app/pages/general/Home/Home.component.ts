import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReloadService } from '../../../shared/service/reload.service';
import { SpecializationService } from '../services/specialization.service';
import { PatientService } from '../../../admin/services/patient.service';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements  OnInit , AfterViewInit {

  constructor(private reload : ReloadService , 
              private patientService: PatientService,
              private specializationService :SpecializationService) { }

  patients: any[] = []; 
  specializations: any[] = [];

  ngAfterViewInit(): void {   
    this.reload.initializeLoader();
  }

  ngOnInit(): void {

    this.patientService.getAllPatient().subscribe(data => {
      this.patients = data.slice(0, 2);
      console.log("getAllPatient ",this.patients[0].reviews[0].review);
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

  services = [
    {
      image: "/images/resource/1.png",
      title: "Orthopedics",
      description:
        "Expert care for bone, joint, and muscle conditions. From fractures to joint replacements, we ensure mobility and pain relief with advanced orthopedic treatments.",
      link: "#",
    },
    {
      image: "/images/resource/2.png",
      title: "Diagnostic Services",
      description:
        "State-of-the-art imaging and laboratory tests for accurate disease detection. Our diagnostic services include MRI, CT scans, blood tests, and more.",
      link: "#",
    },
    {
      image: "/images/resource/3.png",
      title: "Psychology",
      description:
        "Comprehensive mental health support for stress, anxiety, and emotional well-being. Our psychologists provide therapy and counseling tailored to your needs.",
      link: "#",
    },
    {
      image: "/images/resource/4.png",
      title: "General Treatment",
      description:
        "Comprehensive primary care for all ages. From routine check-ups to common illnesses, our general practitioners provide expert medical care with a personal touch.",
      link: "#",
    },
  ];
  
}
