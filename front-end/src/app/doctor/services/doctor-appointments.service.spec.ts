/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DoctorAppointmentsService } from './doctor-appointments.service';

describe('Service: DoctorAppointments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoctorAppointmentsService]
    });
  });

  it('should ...', inject([DoctorAppointmentsService], (service: DoctorAppointmentsService) => {
    expect(service).toBeTruthy();
  }));
});
