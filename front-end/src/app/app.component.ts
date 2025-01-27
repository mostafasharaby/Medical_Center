import { Component } from '@angular/core';
import { ReloadService } from './shared/service/reload.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MedicalCenter';

  showHeaderAndNavbar: boolean = true;
  constructor(private router: Router ,
    private reload : ReloadService
  ) { }


  ngAfterViewInit(): void {   
    this.reload.initializeLoader();
  }
  
  ngOnInit(): void {
    initFlowbite();  

    this.router.events.subscribe(() => {
      this.showHeaderAndNavbar = !this.router.url.includes('/admin')  &&!this.router.url.includes('/doctor')  && !this.router.url.includes('/error') && !this.router.url.includes('/auth');
    });
  }
  
}
