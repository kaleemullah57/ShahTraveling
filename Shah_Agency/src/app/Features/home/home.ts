import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {


   selectedDestination = '';

  travelDate = '';

  travelers = 2;

  duration = 5;

  estimatedPrice = 0;


  increaseTravelers(): void {

    if (this.travelers < 20) {
      this.travelers++;
      this.calculateTrip();
    }

  }


  decreaseTravelers(): void {

    if (this.travelers > 1) {
      this.travelers--;
      this.calculateTrip();
    }

  }


 selectedImage: string | null = null;

openImage(image: string): void {
  this.selectedImage = image;
}

closeImage(): void {
  this.selectedImage = null;
}

  calculateTrip(): void {

    const basePrices: { [key: string]: number } = {

      'Dubai': 899,

      'Turkey': 999,

      'Maldives': 1299,

      'Saudi Arabia': 799

    };


    const basePrice =
      basePrices[this.selectedDestination] || 899;


    const durationMultiplier =
      this.duration / 5;


    this.estimatedPrice = Math.round(
      basePrice *
      durationMultiplier *
      this.travelers
    );

  }


  scrollToCalculator(): void {

    document
      .getElementById('calculator')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

  }


  scrollToDestinations(): void {

    document
      .getElementById('destinations')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

  }
}
