import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
recentOrders = [
  { id: 1234, name: 'John Doe', product: 'Summer Dress', price: 89.99, status: 'Completed' },
  { id: 1235, name: 'Jane Smith', product: 'Casual Shirt', price: 45.50, status: 'Processing' },
  { id: 1236, name: 'Mike Johnson', product: 'Denim Jeans', price: 120.00, status: 'Shipped' },
  { id: 1237, name: 'Sarah Wilson', product: 'Leather Boots', price: 199.99, status: 'Pending' },
  { id: 1238, name: 'Tom Brown', product: 'Winter Coat', price: 299.99, status: 'Completed' },
];

topProducts = [
  { name: 'Summer Floral Dress', sold: 245, revenue: 12250, growth: 15 },
  { name: 'Classic White Shirt', sold: 189, revenue: 8505, growth: 8 },
  { name: 'Denim Skinny Jeans', sold: 156, revenue: 18720, growth: 12 },
  { name: 'Leather Ankle Boots', sold: 134, revenue: 26800, growth: 22 },
  { name: 'Silk Scarf Collection', sold: 98, revenue: 4900, growth: 5 },
];
 // ✅ EXPLICITLY define chart type as 'line'

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [4000, 3000, 2000, 2800, 1900, 2400, 3500],
        label: 'Sales',
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };

  public pieChartType: ChartType = 'pie';
  public pieChartLabels: string[] = ['Dresses', 'Shirts', 'Pants', 'Accessories', 'Shoes'];
  public pieChartData: number[] = [35, 25, 20, 15, 5];



  constructor() { }

  ngOnInit(): void {
  }

}
