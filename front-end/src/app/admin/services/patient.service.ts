import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../pages/auth/auth-services/auth-service.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private patientUrl = `${environment.api}/Patients`;
  constructor(private http: HttpClient , private authService :AuthServiceService) {}

  getAllPatient(): Observable<any[]> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(this.patientUrl , {headers});
  }

}
