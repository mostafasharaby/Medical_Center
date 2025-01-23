import { Component, OnInit } from '@angular/core';
import { SpecializationService } from '../services/specialization.service';
import { DoctorService } from '../services/doctor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-appointment-request',
  templateUrl: './appointment-request.component.html',
  styleUrls: ['./appointment-request.component.css']
})
export class AppointmentRequestComponent implements OnInit {

  constructor(private specializationService: SpecializationService,
              private doctorService: DoctorService,
              private fb: FormBuilder,
              private appointmentsService :AppointmentService
              ) { }

  specializations: any[] = [];
  doctorsData: any[] = [];
  filteredDoctors: any[] = [];
  selectedDepartment: string = '';
  appointmentForm!: FormGroup;
  ngOnInit() {

    this.appointmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]], 
      email: ['', [Validators.required, Validators.email]], 
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]], 
      date: ['', Validators.required], 
      department: ['', Validators.required], 
      doctor: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]] 
    });


    this.loadDoctors();
    this.loadSpecializations();
  }
  get name() {
    return this.appointmentForm.get('name');
  }

  get email() {
    return this.appointmentForm.get('email');
  }

  get phone() {
    return this.appointmentForm.get('phone');
  }

  get date() {
    return this.appointmentForm.get('date');
  }

  get department() {
    return this.appointmentForm.get('department');
  }

  get doctor() {
    return this.appointmentForm.get('doctor');
  }

  get message() {
    return this.appointmentForm.get('message');
  }


  loadSpecializations() {
    this.specializationService.getSpecializations().subscribe(
      (data) => {
        this.specializations = data;
        console.log("specializations ", this.specializations);
      },
      (error) => {
        console.error('Error fetching specializations', error);
      }
    );
  }

  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe(
      (doctorFetched: any[]) => {
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

  filterDoctorsByDepartment() {
    if (this.selectedDepartment) {
      this.filteredDoctors = this.doctorsData.filter(
        (doctor) => doctor.specializations.includes(this.selectedDepartment)
      );
    } else {
      this.filteredDoctors = [];
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointmentData = {
        name: this.name?.value,
        email: this.email?.value,
        phone: this.phone?.value,
        doctorName: this.doctor?.value,
        probableStartTime: this.date?.value,
        appointmentStatusId: 3,
      };
  
      this.appointmentsService.postAppointment(appointmentData).subscribe(
        (response) => {
          console.log('Appointment posted successfully:', response);
          alert('Appointment saved!');
        },
        (error) => {
          console.error('Error posting appointment:', error);
          alert('Failed to save the appointment.');
        }
      );
    } else {
      alert('Please fill all required fields.');
    }
  }
  
  


}
