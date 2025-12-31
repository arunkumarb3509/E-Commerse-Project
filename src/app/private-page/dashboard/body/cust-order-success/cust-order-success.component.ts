import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/Services/cart.service';

@Component({
  selector: 'app-cust-order-success',
  templateUrl: './cust-order-success.component.html',
  styleUrls: ['./cust-order-success.component.scss']
})
export class CustOrderSuccessComponent implements OnInit {
 orderId: string | null = null;
  order: any = null;
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService:CartService
  ) { }

  ngOnInit(): void {
    alert("worked")
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    if (!this.orderId) {
      this.loading = false;
      return;
    }

     this.cartService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        if (res?.success) this.order = res.order;
        else this.order = res.order || null;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

   goToOrders() {
    this.router.navigate(['/my-orders']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

}
