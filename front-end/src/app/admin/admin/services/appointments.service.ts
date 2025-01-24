import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../../pages/auth/auth-services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

private apiUrl = `${environment}/Appointments`;

  constructor(private http: HttpClient , private authService :AuthServiceService) {}

  getAppointments(): Observable<any[]> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(this.apiUrl,{ headers });
  }
}
