import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  constructor() { }

 currentSlide = 0;
  intervalSub!: Subscription;

  slides = [
    {
      id: 1,
      title: 'Dress to Impress',
      subtitle: 'Adding personality to your outfit',
      // image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2070&q=80',
     image: '../../assets/Images/caurosel1.avif',
      buttonText: 'Shop Now',
      position: 'left'
    },
    {
      id: 2,
      title: 'The art of mixing and matching',
      subtitle: 'From day to night',
      // image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2071&q=80',
      image: '../../assets/Images/caurosel2.avif',
      buttonText: 'Explore',
      position: 'right'
    },
    {
      id: 3,
      title: 'Fashion Agency',
      subtitle: 'Your style destination',
      image: '../../assets/Images/caurosel3.avif',
      // image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2070&q=80',
      buttonText: 'Discover',
      position: 'center'
    }
  ];

  ngOnInit(): void {
    this.intervalSub = interval(5000).subscribe(() => {
      this.nextSlide();
    });
  }

  ngOnDestroy(): void {
    this.intervalSub.unsubscribe();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

}
