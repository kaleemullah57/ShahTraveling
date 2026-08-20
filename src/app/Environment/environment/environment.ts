import { Component } from '@angular/core';

export const environment = {
  production: false,
  apiUrl: 'https://localhost:7298/api'
};
@Component({
  selector: 'app-environment',
  standalone : true,
  imports: [],
  templateUrl: './environment.html'
})
export class Environment {
  
}
