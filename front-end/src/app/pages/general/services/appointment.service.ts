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

  constructor(private http: HttpClient , private authService:AuthServiceService) {}
  postAppointment(data: any): Observable<any> {   
    const headers = this.authService.getHeaders();   
    return this.http.post(this.apiUrl, JSON.stringify(data), { headers });
  }

}
