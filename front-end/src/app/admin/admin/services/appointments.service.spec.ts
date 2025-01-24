/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppointmentsService } from './appointments.service';

describe('Service: Appointments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppointmentsService]
    });
  });

  it('should ...', inject([AppointmentsService], (service: AppointmentsService) => {
    expect(service).toBeTruthy();
  }));
});
