import { Component, OnInit } from '@angular/core';
import { getFullYear } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-copy-right',
  templateUrl: './copy-right.component.html',
  styleUrls: ['./copy-right.component.scss']
})
export class CopyRightComponent implements OnInit {
 CopyRights : any ;
  constructor() { }

  ngOnInit(): void {
    let today = new Date();
    this.CopyRights = today.getFullYear();
  }

}
