import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/Services/cart.service';

@Component({
  selector: 'app-cust-my-order',
  templateUrl: './cust-my-order.component.html',
  styleUrls: ['./cust-my-order.component.scss']
})
export class CustMyOrderComponent implements OnInit {
orders: any[] = [];
  loading = true;
  filterStatus = '';
  searchText = '';
  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
     const customerId = Number(localStorage.getItem('userId'));
    if (!customerId) {
      this.orders = [];
      this.loading = false;
      return;
    }
    this.cartService.getCustomerOrders(customerId).subscribe({
      next: (res) => {
        if (res?.success) this.orders = res.orders || [];
        else this.orders = res.orders || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  viewOrder(order: any) {
    this.router.navigate(['/order-tracking', order._id]);
  }

  filteredOrders() {
    const q = (this.searchText || '').toLowerCase().trim();
    return this.orders.filter(o => {
      if (this.filterStatus && o.status !== this.filterStatus) return false;
      if (!q) return true;
      return (o._id && o._id.toLowerCase().includes(q)) ||
             (o.customerName && o.customerName.toLowerCase().includes(q));
    });
  }

}
