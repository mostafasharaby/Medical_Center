import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReloadService } from '../../../shared/service/reload.service';
import { DoctorService } from '../../../pages/general/services/doctor.service';
import { DoctorAppointmentsService } from '../../services/doctor-appointments.service';
import { AuthServiceService } from '../../../pages/auth/auth-services/auth-service.service';
import { FlowbiteService } from '../../../shared/service/Flowbite.service';
import * as Flowbite from 'flowbite';
import { SearchService } from '../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../../../pages/general/delete-modal/delete-modal.component';


@Component({
  selector: 'app-related-appointments',
  templateUrl: './related-appointments.component.html'
})
export class RelatedAppointmentsComponent implements OnInit {

  @ViewChild(DeleteModalComponent) deleteModal!: DeleteModalComponent;
  
  constructor(private reload: ReloadService,
    private doctorService: DoctorAppointmentsService,
    private authService: AuthServiceService,
    private flowbiteService: FlowbiteService,
    private toaster: ToastrService,
    private searchService: SearchService) { }


  doctorId: string = '';
  allBookings: any[] = [];
  todayBookings: any[] = [];
  upComingBookings: any[] = [];
  last30DaysBookings: any[] = [];
  tempBookings: any[] = [];
  errorMessage: string = '';
  selectedAppointmentId!: number;

  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }

  ngOnInit(): void {
    this.setDoctorId();
    this.getAllBookings();
    this.getTodayBookings();
    this.getUpComingBookings();
    this.getLast30DaysBookings();
    this.loadFlowbite();

  }


  loadFlowbite(): void {
    if (typeof Flowbite !== 'undefined') {
      const dropdownButton = document.getElementById('dropdownRadioButton');
      const dropdownMenu = document.getElementById('dropdownRadio');

      if (dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener('click', () => {
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
    } else {
      console.error(this.errorMessage);
    }
  }

  getAllBookings(): void {
    this.doctorService.getAllDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.allBookings = data;
        console.log("allBookings", this.allBookings);
        this.filterBookingsByDropDownList();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getTodayBookings(): void {
    this.doctorService.getTodayDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.todayBookings = data;
        console.log("todayBookings", this.todayBookings);
        this.filterBookingsByDropDownList();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getUpComingBookings(): void {
    this.doctorService.getUpCommingDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.upComingBookings = data;
        console.log("upComingBookings", this.upComingBookings);
        this.filterBookingsByDropDownList();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getLast30DaysBookings(): void {
    this.doctorService.getLast30DaysDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.last30DaysBookings = data;
        console.log("last30DaysBookings", this.last30DaysBookings);
        this.filterBookingsByDropDownList();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteAppointment(appointmentId: number): void {
    this.doctorService.deleteBooking(this.doctorId, appointmentId).subscribe(
      (response) => {
        console.log("Appointment deleted successfully");
        this.toaster.success("Appointment deleted successfully");
        this.getAllBookings();
      },
      (error) => {
        console.error('Error deleting appointment', error);
        this.toaster.error("Error deleting appointment");
      }
    );

  }
  openDeleteModal(id: number) {
    this.selectedAppointmentId = id;
    this.deleteModal.showModal();
  }
 

  selectedFilter: string = '1';
  filters = [
    { id: '1', label: 'All days' },
    { id: '2', label: 'Todday' },
    { id: '3', label: 'Up Coming' },
    { id: '4', label: 'Last 30 days' }

  ];

  onFilterChange(selected: string): void {
    this.selectedFilter = selected;
    console.log('Selected filter:', this.selectedFilter);
    this.filterBookingsByDropDownList();
  }

  getSelectedLabel(): string {
    const selectedFilterObject = this.filters.find(filter => filter.id === this.selectedFilter);
    return selectedFilterObject ? selectedFilterObject.label : 'Select Filter';
  }

  filterBookingsByDropDownList(): void {
    switch (this.selectedFilter) {
      case '2':
        this.tempBookings = this.todayBookings
        break;
      case '3':
        this.tempBookings = this.upComingBookings
        break;
      case '4':
        this.tempBookings = this.last30DaysBookings
        break;
      case '1':
        this.tempBookings = this.allBookings;
        break;
      default:
        break;
    }
    console.log('Filtered Bookings:', this.tempBookings, this.selectedFilter); // Debug the bookings
  }


  public searchItem !: string;
  search(event: any) {
    const query = this.searchItem.toLowerCase().trim();
    console.log('Searching ', this.searchItem);
    this.searchService.setSearchTerm(query);
    this.filterBookingsBySearch(query);
  }

  filterBookingsBySearch(query: string) {
    if (!query) {
      this.getAllBookings();
    } else {
      this.tempBookings = this.tempBookings.filter(booking =>
        booking.patient.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }


}
