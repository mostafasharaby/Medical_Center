import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReloadService } from '../../../shared/service/reload.service';
import { DoctorService } from '../../../pages/general/services/doctor.service';
import { DoctorAppointmentsService } from '../../services/doctor-appointments.service';
import { AuthServiceService } from '../../../pages/auth/auth-services/auth-service.service';
import { FlowbiteService } from '../../../shared/service/Flowbite.service';
import * as Flowbite from 'flowbite';
import { SearchService } from '../../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-related-appointments',
  templateUrl: './related-appointments.component.html'
})

export class RelatedAppointmentsComponent implements OnInit, OnDestroy {

  @ViewChild(DeleteModalComponent) deleteModal!: DeleteModalComponent;

  private subscriptions: Subscription[] = []; // Track subscriptions
  
  constructor(
    private reload: ReloadService,
    private doctorService: DoctorAppointmentsService,
    private authService: AuthServiceService,
    private flowbiteService: FlowbiteService,
    private toaster: ToastrService,
    private searchService: SearchService
  ) { }

  doctorId: string = '';
  allBookings: any[] = [];
  todayBookings: any[] = [];
  upComingBookings: any[] = [];
  last30DaysBookings: any[] = [];
  tempBookings: any[] = [];
  errorMessage: string = '';
  selectedAppointmentId!: number;
  selectedFilter: string = '1';

  filters = [
    { id: '1', label: 'All days' },
    { id: '2', label: 'Today' },
    { id: '3', label: 'Up Coming' },
    { id: '4', label: 'Last 30 days' }
  ];

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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log("Component destroyed, subscriptions unsubscribed.");
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
    const sub = this.doctorService.getAllDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.allBookings = data;
        this.filterBookingsByDropDownList();
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.subscriptions.push(sub);
  }

  getTodayBookings(): void {
    const sub = this.doctorService.getTodayDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.todayBookings = data;
        this.filterBookingsByDropDownList();
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.subscriptions.push(sub);
  }

  getUpComingBookings(): void {
    const sub = this.doctorService.getUpCommingDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.upComingBookings = data;
        this.filterBookingsByDropDownList();
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.subscriptions.push(sub);
  }

  getLast30DaysBookings(): void {
    const sub = this.doctorService.getLast30DaysDoctorBookings(this.doctorId).subscribe({
      next: (data) => {
        this.last30DaysBookings = data;
        this.filterBookingsByDropDownList();
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.subscriptions.push(sub);
  }

  deleteAppointment(appointmentId: number): void {
    const sub = this.doctorService.deleteBooking(this.doctorId, appointmentId).subscribe(
      () => {
        this.toaster.success("Appointment deleted successfully");
        this.getAllBookings();
      },
      (error) => {
        console.error('Error deleting appointment', error);
        this.toaster.error("Error deleting appointment");
      }
    );
    this.subscriptions.push(sub);
  }

  openDeleteModal(id: number) {
    this.selectedAppointmentId = id;
    this.deleteModal.showModal();
  }

  onFilterChange(selected: string): void {
    this.selectedFilter = selected;
    this.filterBookingsByDropDownList();
  }

  getSelectedLabel(): string {
    const selectedFilterObject = this.filters.find(filter => filter.id === this.selectedFilter);
    return selectedFilterObject ? selectedFilterObject.label : 'Select Filter';
  }

  filterBookingsByDropDownList(): void {
    switch (this.selectedFilter) {
      case '2':
        this.tempBookings = this.todayBookings;
        break;
      case '3':
        this.tempBookings = this.upComingBookings;
        break;
      case '4':
        this.tempBookings = this.last30DaysBookings;
        break;
      case '1':
        this.tempBookings = this.allBookings;
        break;
    }
  }

  searchItem!: string;
  search(event: any) {
    const query = this.searchItem.toLowerCase().trim();
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
