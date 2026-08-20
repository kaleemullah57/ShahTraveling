import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "./Shared/layout/header/header";
import { Footer } from "./Shared/layout/footer/footer";
import { Whatsapp } from "./Shared/components/whatsapp/whatsapp";


@Component({
  selector: 'app-root',
  standalone : true,
  imports: [RouterOutlet, Header, Footer, Whatsapp],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
 private router = inject(Router);

  get isSuperAdmin(): boolean {

    return this.router.url.startsWith('/SuperAdminDashboard');

  }

}
