import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {

  private apiUrl = `${environment.api}/Specializations`;

  constructor(private http: HttpClient , private authService :AuthServiceService) {}


  getSpecializations(): Observable<any> {
    const headers = this.authService.getHeaders(); 
    return this.http.get<any>(this.apiUrl,{headers});
  }

}
