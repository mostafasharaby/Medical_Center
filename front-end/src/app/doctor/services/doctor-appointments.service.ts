import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from '../../pages/auth/auth-services/auth-service.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorAppointmentsService {

  private readonly apiUrl = `${environment.api}/Doctors`;
  constructor(private http: HttpClient, private authService:AuthServiceService) {}

  getAllDoctorBookings(doctorId: string): Observable<any> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(`${this.apiUrl}/${doctorId}/bookings` , {headers});   
  }

  getTodayDoctorBookings(doctorId: string): Observable<any> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(`${this.apiUrl}/${doctorId}/bookings/today` , {headers});   
  }

  
  getUpCommingDoctorBookings(doctorId: string): Observable<any> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(`${this.apiUrl}/${doctorId}/bookings/UpComing` , {headers});   
  }

  getLast30DaysDoctorBookings(doctorId: string): Observable<any> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(`${this.apiUrl}/${doctorId}/bookings/Last30Days` , {headers});   
  }

  getSpecialDoctor(doctorId: string): Observable<any> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any>(`${this.apiUrl}/${doctorId}` , {headers});   
  }

  deleteBooking(doctorId: string, bookingId: number): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete(`${this.apiUrl}/${doctorId}/appointments/${bookingId}`, { headers });
  }

}
