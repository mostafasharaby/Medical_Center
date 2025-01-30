import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as Flowbite from 'flowbite';
@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('cancelDelete') cancelDelete!: ElementRef;
  @ViewChild('confirmDelete') confirmDelete!: ElementRef;

  @Input() itemId!: number;
  @Output() confirm = new EventEmitter<number>(); 
  private modalInstance: any;
  ngAfterViewInit() {
    this.modalInstance = new Flowbite.Modal(this.deleteModal.nativeElement);
  }

  showModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
      this.cancelDelete.nativeElement.onclick = () => this.modalInstance.hide();
      this.confirmDelete.nativeElement.onclick = () => {
        this.modalInstance.hide();
        this.confirm.emit(this.itemId);
      };
    }
  }
}
