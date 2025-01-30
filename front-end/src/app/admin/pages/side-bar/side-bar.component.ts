import { Component, OnInit } from '@angular/core';
import { DoctorMENU, MENU } from '../../menu';
import * as Flowbite from 'flowbite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit {
  
  constructor(private router: Router) { }
  ngOnInit() {
    this.loadFlowbite();
    this.checkIfDoctorRoute();

  }
  menuItems:any;
  checkIfDoctorRoute(): void {
    if (this.router.url.includes('doctor/')) {
      this.menuItems = DoctorMENU; 
    } else {
      this.menuItems = MENU; 
    }
  }

  loadFlowbite(): void {
    if (typeof Flowbite !== 'undefined') {
      const dropdownMenu = document.getElementById('dropdown-user');
      
      if (dropdownMenu) {
        dropdownMenu.addEventListener('click', () => {
          dropdownMenu.classList.toggle('hidden');
        });
      }
    }
  }
 
}
