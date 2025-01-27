import { Component, OnInit } from '@angular/core';
import { MENU } from '../../menu';
import * as Flowbite from 'flowbite';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  
  menuItems = MENU;

  constructor() { }

  ngOnInit() {
    this.loadFlowbite();
  }
  loadFlowbite(): void {
    // Ensure Flowbite is loaded and then initialize the dropdown
    if (typeof Flowbite !== 'undefined') {
      // Dropdown will be automatically initialized by Flowbite
      const dropdownMenu = document.getElementById('dropdown-user');
      
      // If you need to manually control it, you can add event listeners
      if (dropdownMenu) {
        dropdownMenu.addEventListener('click', () => {
          // Flowbite's built-in functionality will handle this toggle
          dropdownMenu.classList.toggle('hidden');
        });
      }
    }
  }
 
}
