import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DoctorService } from '../../../../pages/general/services/doctor.service';
import { Doctor } from '../../../../pages/models/doctor';
import { AppointmentService } from '../../../../pages/general/services/appointment.service';
import { MENU } from '../../menu';
import { ReloadService } from '../../../../shared/service/reload.service';
import { PatientService } from '../../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../../../../doctor/pages/delete-modal/delete-modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  appointments: any[] = [];
  infoBoxes: any[] = [];
  doctorsData: Doctor[] = [];
  numOfAppointments: number = 0;
  numOfDoctors: number = 0;
  numOfPatients: number = 0;
  selectedAppointmentId!: number;
  menuItems = MENU;

  constructor(private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private reload: ReloadService,
    private toaster: ToastrService,
    private patientService: PatientService) { }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctor();
    this.fetchPatientLength();
    this.optimizeWidget();
    this.setBadgeForAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data;
        this.numOfAppointments = this.appointments.length;
        this.optimizeWidget();
        this.setBadgeForAppointments();
        console.log('Fetched appointments:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }

  loadDoctor(): void {
    this.doctorService.getAllDoctors().subscribe(
      (doctorFetched: Doctor[]) => {
        if (doctorFetched) {
          this.doctorsData = doctorFetched;
          this.numOfDoctors = this.doctorsData.length;
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

  fetchPatientLength(): void {
    this.patientService.getPatientReviews().subscribe({
      next: (data) => {
        this.numOfPatients = data.length;
        this.optimizeWidget();
      },
      error: () => {
        console.error();
      }
    });
  }

  setBadgeForAppointments() {
    const appointmentItem = this.menuItems.find(item => item.title === 'Appointment');
    if (appointmentItem) {
      appointmentItem.badge = this.numOfAppointments.toString();
    }
  }

  optimizeWidget(): void {
    this.infoBoxes = [
      {
        bgClass: 'bg-blue',
        iconClass: 'fas fa-users',
        text: 'Appointments',
        number: this.numOfAppointments,
        progress: 45,
        description: '45% Increase in 28 Days',
      },
      {
        bgClass: 'bg-orange',
        iconClass: 'fas fa-user',
        text: 'New Patients',
        number: this.numOfPatients,
        progress: 40,
        description: '40% Increase in 28 Days',
      },
      {
        bgClass: 'bg-purple',
        iconClass: 'fas fa-syringe',
        text: 'Doctors',
        number: this.numOfDoctors,
        progress: 85,
        description: '85% Increase in 28 Days',
      },
      {
        bgClass: 'bg-success',
        iconClass: 'fas fa-dollar-sign',
        text: 'PrimeCare Earning',
        number: '3,921$',
        progress: 50,
        description: '50% Increase in 28 Days',
      },
    ];
  }

  openDeleteModal(id: number) {
    this.selectedAppointmentId = id;
    this.deleteModal.showModal();
  }
  @ViewChild(DeleteModalComponent) deleteModal!: DeleteModalComponent;
  onDeleteAppointment(id: number) {
    this.appointmentService.deleteBookingById(id).subscribe({
      next: () => {
        this.toaster.success("Appointment deleted successfully");
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error deleting appointment:', err);
        this.toaster.error("Error deleting appointment");
      }
    });
  }

  @ViewChild('editModal', { static: false }) editModal!: ElementRef;
  appointmentDate: string = '';
  appointmentTime: string = '';
  // Open Modal
  onEditeAppointment(id: number, appointmentDate: string): void {
    this.selectedAppointmentId = id;
    this.appointmentDate = appointmentDate.split('T')[0];
    this.appointmentTime = appointmentDate.split('T')[1]?.substring(0, 5) || '';

    console.log("selectedAppointmentId", this.selectedAppointmentId);
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      modalElement.classList.add('hidden');
    }
  }

  saveAppointment(): void {
    const updatedAppointment = {
      id: this.selectedAppointmentId,
      appointmentTakenDate: this.appointmentDate + 'T' + this.appointmentTime,
    };
    console.log("Updated", JSON.stringify(updatedAppointment));
    if (!this.selectedAppointmentId) {
      this.toaster.error("No appointment selected!");
      return;
    }

    this.appointmentService.editeBooking(this.selectedAppointmentId, updatedAppointment).subscribe({
      next: () => {
        this.toaster.success("Appointment Updated successfully");
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error Updating appointment:', err);
        this.toaster.error("Error Updating appointment");
      }
    });
    console.log('Updated Date:', this.appointmentDate);
    this.closeModal();
  }

}
