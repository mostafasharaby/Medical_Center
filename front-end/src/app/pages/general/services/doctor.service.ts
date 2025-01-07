import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';
import { HandleErrorsService } from '../../../shared/service/handle-errors.service';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Doctor } from '../../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

private apiUrl = `${environment.api}/DoctorsWithSpectialization`;  

  constructor(private http: HttpClient ,
              private authService :AuthServiceService ,
              private handeErrorService :HandleErrorsService) {}


public doctorsSubject = new BehaviorSubject<any[]>([]);
cartItems$ = this.doctorsSubject.asObservable();


  getAllDoctors(): Observable<Doctor[]> {
    const headers = this.authService.getHeaders();  
    return this.http.get<Doctor[]>(this.apiUrl, { headers }).pipe(
      tap((doctors: Doctor[]) => {
        this.doctorsSubject.next(doctors);
        console.log('Doctors fetched from API:', doctors.length);
      }),
      catchError(this.handeErrorService.handleError)
    );
  }
 
}
