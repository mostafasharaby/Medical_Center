import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../../pages/auth/auth-services/auth-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatedPatientsReviewsService {

 private readonly apiUrl = `${environment.api}/Doctors`;
  constructor(private http: HttpClient, private authService:AuthServiceService) {}

  getPatientsReview(doctorId: string): Observable<any> {
    const headers = this.authService.getHeaders();  
    return this.http.get<any[]>(`${this.apiUrl}/${doctorId}/reviews` , {headers});   
  }


}
