import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  socialMediaLinks = [
    { name: 'Facebook', icon: 'bi bi-facebook'},
    { name: 'Twitter', icon: 'bi bi-twitter' },
    { name: 'Youtube', icon: 'bi bi-pinterest' },
    { name: 'Instagram', icon: 'bi bi-instagram'},
    { name: 'Youtube', icon: 'bi bi-youtube' }

  ];
  constructor() { }

  ngOnInit(): void {
  }

}
