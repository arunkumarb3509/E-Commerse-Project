import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-size',
  templateUrl: './product-size.component.html',
  styleUrls: ['./product-size.component.scss']
})
export class ProductSizeComponent implements OnInit {
  @Input() selectedCategory: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
