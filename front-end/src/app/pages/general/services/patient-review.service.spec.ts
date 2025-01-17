/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PatientReviewService } from './patient-review.service';

describe('Service: PatientReview', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientReviewService]
    });
  });

  it('should ...', inject([PatientReviewService], (service: PatientReviewService) => {
    expect(service).toBeTruthy();
  }));
});
