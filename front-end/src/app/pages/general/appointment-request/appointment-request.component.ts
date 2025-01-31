import { Component, OnInit } from '@angular/core';
import { SpecializationService } from '../services/specialization.service';
import { DoctorService } from '../services/doctor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-request',
  templateUrl: './appointment-request.component.html',
  styleUrls: ['./appointment-request.component.css']
})
export class AppointmentRequestComponent implements OnInit {

  constructor(private specializationService: SpecializationService,
    private doctorService: DoctorService,
    private fb: FormBuilder,
    private appointmentsService: AppointmentService,
    private authService: AuthServiceService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  specializations: any[] = [];
  doctorsData: any[] = [];
  filteredDoctors: any[] = [];
  selectedDepartment: string = '';
  appointmentForm!: FormGroup;
  isLoggedIn = true;
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
    this.checkAuthenication();
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

  checkAuthenication() {
    this.authService.getloggedStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
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
  postAppointment(appointmentData: any) {
    this.appointmentsService.postAppointment(appointmentData).subscribe(
      (response) => {
        console.log('Appointment posted successfully:', response);
        this.toastr.success('Appointment saved!', 'Success', {
          positionClass: 'toast-bottom-left'
        });
        this.toastr.info('Please Check your email account to verify', 'Success', {
          positionClass: 'toast-bottom-left'
        });
      },
      (error) => {
        console.error('Error posting appointment:', error);
        this.toastr.info('Please fill all required fields.');
      }
    );
  }

  paymentSuccessful: boolean = false;
  pendingAppointment: any = null;  
  showModal = false;
  onSubmit() {
    if (this.isLoggedIn) {
      if (this.appointmentForm.valid) {  
        const appointmentData = {
          name: this.name?.value,
          email: this.email?.value,
          phone: this.phone?.value,
          doctorName: this.doctor?.value,
          probableStartTime: this.date?.value,
          appointmentTakenDate: this.date?.value
        };
        this.toastr.info('The total cost for your appointment is $30. Secure your booking now!', 'Payment Details', {
          positionClass: 'toast-bottom-left'
        });
        this.showModal = true;
        console.log('appointmentData:', appointmentData);
        this.pendingAppointment = appointmentData;
      } else {
        this.toastr.info('Please fill all required fields.');
      }
    } else {
      this.toastr.warning('Please login to book an appointment');
      this.router.navigate(['/auth/login']);
    }
  }


  handlePaymentStatus(status: boolean) {
    this.paymentSuccessful = status;
    console.log("handlePaymentStatus called:", this.paymentSuccessful);
    if (this.paymentSuccessful && this.pendingAppointment) {
      console.log('Payment successful! Posting appointment...');
      this.postAppointment(this.pendingAppointment);
      this.appointmentForm.reset();
      this.showModal = false;  
      this.pendingAppointment = null; 
    }
  }


}
