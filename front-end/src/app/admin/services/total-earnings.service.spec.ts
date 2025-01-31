/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TotalEarningsService } from './total-earnings.service';

describe('Service: TotalEarnings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TotalEarningsService]
    });
  });

  it('should ...', inject([TotalEarningsService], (service: TotalEarningsService) => {
    expect(service).toBeTruthy();
  }));
});
