import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReloadService } from '../../../shared/service/reload.service';
import { DoctorService } from '../../../pages/general/services/doctor.service';
import { DoctorAppointmentsService } from '../../services/doctor-appointments.service';
import { AuthServiceService } from '../../../pages/auth/auth-services/auth-service.service';
import { FlowbiteService } from '../../../shared/service/Flowbite.service';
import * as Flowbite from 'flowbite';
@Component({
  selector: 'app-related-appointments',
  templateUrl: './related-appointments.component.html',
  styleUrls: ['./related-appointments.component.css']
})
export class RelatedAppointmentsComponent implements OnInit {
  constructor(private reload: ReloadService,
    private doctorService: DoctorAppointmentsService,
    private authService: AuthServiceService,
    private flowbiteService: FlowbiteService) { }


  doctorId: string = '';
  bookings: any[] = [];
  errorMessage: string = '';

  ngAfterViewInit(): void {
    this.reload.initializeLoader();
    //this.loadFlowbite();
  }

  ngOnInit(): void {
    this.setDoctorId();  // the arrangement is important 
    this.getBookings();
  //  this.onDelete();
  this.loadFlowbite();
  }


  loadFlowbite(): void {
    // Ensure Flowbite is loaded and then initialize the dropdown
    if (typeof Flowbite !== 'undefined') {
      // Dropdown will be automatically initialized by Flowbite
      const dropdownButton = document.getElementById('dropdownRadioButton');
      const dropdownMenu = document.getElementById('dropdownRadio');
      
      // If you need to manually control it, you can add event listeners
      if (dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener('click', () => {
          // Flowbite's built-in functionality will handle this toggle
          dropdownMenu.classList.toggle('hidden');
        });
      }
    }
  }

  setDoctorId(): void {
    const id = this.authService.getNameIdentifier();
    console.log("id", id);
    if (id) {
      this.doctorId = id;
      console.log("doctorId", this.doctorId);
    } else {
      this.errorMessage = 'Failed to fetch doctor ID. Please log in again.';
      console.error(this.errorMessage);
    }
  }
  getBookings(): void {

    console.log("in progress", this.doctorId);
    if (!this.doctorId) {
      console.error('Doctor ID is not set.');
      return;
    }

    this.doctorService.getDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.bookings = data;
        console.log("Bookings", this.bookings);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings. Please try again later.';
        console.error(error);
      },
    });
  }

  deleteAppointment(appointmentId: string): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.doctorService.deleteBooking(this.doctorId, appointmentId).subscribe(
        (response) => {
          //this.toastr.success('Appointment deleted successfully!');
          this.getBookings();
        },
        (error) => {
          console.error('Error deleting appointment', error);
          //  this.toastr.error('Failed to delete appointment.');
        }
      );
    }
  }


  onDelete() {
    console.log("delete");
    const modal = document.getElementById('deleteModal');
    if (modal) {
      const modalInstance = new Flowbite.Modal(modal);
      modalInstance.show(); // Show the modal
    }
  }



  

  selectedFilter: string = '7';
  filters = [
    { id: '1', label: 'Last day' },
    { id: '7', label: 'Last 7 days' },
    { id: '30', label: 'Last 30 days' },
    { id: 'custom', label: 'Custom range' }
  ];

  onFilterChange(selected: string): void {
    this.selectedFilter = selected;
    console.log('Selected filter:', this.selectedFilter);
    // Add your logic to handle the selected filter here
  }

}
