import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PublicDestinationsService } from '../../Core/Services/public Services/Destinations Service/public-destinations-service';
import { GetPublicDestinationModel,PublicDestinationResponse } from '../../Core/Models/Public Destinations Model/public-destinations-model';
import { Button } from "../../Shared/components/button/button";

@Component({
  selector: 'app-destinations',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    Button
],

  templateUrl: './destinations.html',
  styleUrl: './destinations.scss'
})
export class Destinations implements OnInit {

  private readonly destinationService =
    inject(PublicDestinationsService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  destinations: GetPublicDestinationModel[] = [];

  selectedDestination:
    GetPublicDestinationModel | null = null;

  searchText = '';

  searchedText = '';

  sortOption = 'default';

  loading = false;

  errorMessage = '';

  readonly apiBaseUrl =
    environment.apiUrl.replace('/api', '');

  ngOnInit(): void {

    this.getDestinations();

  }

  getDestinations(search?: string): void {

    this.loading = true;

    this.errorMessage = '';

    const searchValue =
      search?.trim() || undefined;


    this.destinationService
      .getPublicDestinations(searchValue)

      .pipe(

        finalize(() => {

          this.loading = false;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        next: (response: PublicDestinationResponse) => {
          if (response.status === true) {

            this.destinations =
              response.data ?? [];

            this.searchedText =
              searchValue ?? '';

            this.applySort();

          }

          else {

            this.destinations = [];

            this.errorMessage =
              response.message ||
              'No destinations found.';

          }


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Get Destinations Error:',
            error
          );


          this.destinations = [];


          this.errorMessage =
            error?.error?.message ||
            'Unable to load destinations.';


          this.cdr.detectChanges();

        }

      });

  }

  searchDestinations(): void {

    const search =
      this.searchText.trim();


    if (search === '') {

      this.searchedText = '';

      this.getDestinations();

      return;

    }


    this.getDestinations(search);

  }

  onSearchKeydown(
    event: KeyboardEvent
  ): void {

    if (event.key === 'Enter') {

      event.preventDefault();

      this.searchDestinations();

    }

  }


  clearSearch(): void {

    this.searchText = '';

    this.searchedText = '';

    this.getDestinations();

  }


  onSortChange(): void {

    this.applySort();

  }


 private applySort(): void {
  if (this.sortOption === 'default') {
    return;
  }

  if (this.sortOption === 'az') {
    this.destinations = [...this.destinations].sort((a, b) =>
      (a.destinationName || '').localeCompare(
        b.destinationName || ''
      )
    );
  }

  if (this.sortOption === 'za') {
    this.destinations = [...this.destinations].sort((a, b) =>
      (b.destinationName || '').localeCompare(
        a.destinationName || ''
      )
    );
  }
}


  getImageUrl(
    path: string | null | undefined
  ): string {

    if (!path) {
      return '';
    }


    if (
      path.startsWith('http://') ||
      path.startsWith('https://')
    ) {

      return path;

    }


    return `${this.apiBaseUrl}${path}`;

  }


  imageError(event: Event): void {

    const image =
      event.target as HTMLImageElement;

    image.style.display = 'none';

  }


  openDestination(
    destination: GetPublicDestinationModel
  ): void {

    this.selectedDestination =
      destination;


    document.body.style.overflow =
      'hidden';


    this.cdr.detectChanges();

  }


  closeDestination(): void {

    this.selectedDestination = null;

    document.body.style.overflow = '';

    this.cdr.detectChanges();

  }



  onKeyDown(
    event: KeyboardEvent
  ): void {

    if (
      event.key === 'Escape' &&
      this.selectedDestination
    ) {

      this.closeDestination();

    }

  }

}