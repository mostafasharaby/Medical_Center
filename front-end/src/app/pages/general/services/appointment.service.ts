import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl =  `${environment.api}/Appointments`;
  private getAppointmentsUrl = `${environment.api}/Appointments/GetAllAppointments`;

  constructor(private http: HttpClient , private authService:AuthServiceService) {}
  postAppointment(data: any): Observable<any> {   
    const headers = this.authService.getHeaders();   
    return this.http.post(this.apiUrl, JSON.stringify(data), { headers });
  }
  getAppointments(): Observable<any[]> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(this.getAppointmentsUrl,{ headers });
  }
  deleteBookingById(Id: number): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete(`${this.apiUrl}/${Id}`, { headers });
  }
  editeBooking(Id: number, updatedAppointment: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/${Id}`,updatedAppointment, { headers });
  }

}
