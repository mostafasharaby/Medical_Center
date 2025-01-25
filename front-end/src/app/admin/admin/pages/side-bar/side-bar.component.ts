import { Component, OnInit } from '@angular/core';
import { MENU } from '../../menu';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  
  menuItems = MENU;

  constructor() { }

  ngOnInit() {
  }
 
}
