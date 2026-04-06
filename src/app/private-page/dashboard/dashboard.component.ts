import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService) {
    
  }

  ngOnInit(): void {
  }

  clearUser(){
    this.spinner.show();
    localStorage.clear();
    window.location.href = '/customer-signIn';
    this.spinner.hide();
  }

}
