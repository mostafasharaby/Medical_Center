/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RelatedPatientsReviewsService } from './related-patients-reviews.service';

describe('Service: PatientsReviews', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelatedPatientsReviewsService]
    });
  });

  it('should ...', inject([RelatedPatientsReviewsService], (service: RelatedPatientsReviewsService) => {
    expect(service).toBeTruthy();
  }));
});
