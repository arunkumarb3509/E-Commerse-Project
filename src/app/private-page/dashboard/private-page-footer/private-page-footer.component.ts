import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private-page-footer',
  templateUrl: './private-page-footer.component.html',
  styleUrls: ['./private-page-footer.component.scss']
})
export class PrivatePageFooterComponent implements OnInit {
copyRightsYear : any ;
  constructor() { }

  ngOnInit(): void {
    let today = new Date();
    this.copyRightsYear = today.getFullYear();
  }

}
