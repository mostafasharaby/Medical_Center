import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from '../../pages/auth/auth-services/auth-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorAppointmentsService {

  private readonly apiUrl = 'http://localhost:5004/api/Doctors';

  constructor(private http: HttpClient, private authService:AuthServiceService) {}

  // Method to get bookings by doctor ID
  getDoctorBookings(doctorId: string): Observable<any> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(`${this.apiUrl}/${doctorId}/bookings` , {headers});   
  }
  deleteBooking(doctorId: string, bookingId: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete(`${this.apiUrl}/${doctorId}/bookings/${bookingId}`, { headers });
  }

}
