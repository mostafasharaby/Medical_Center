import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReloadService } from '../../../shared/service/reload.service';

@Component({
  selector: 'app-request-appointment',
  templateUrl: './request-appointment.component.html',
  styleUrls: ['./request-appointment.component.css']
})
export class RequestAppointmentComponent implements OnInit,AfterViewInit {

  constructor(private reload :ReloadService) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {   
    this.reload.initializeLoader();
  }
  
}
