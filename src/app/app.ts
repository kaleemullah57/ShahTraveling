import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./Shared/layout/header/header";
import { Footer } from "./Shared/layout/footer/footer";
import { Whatsapp } from "./Shared/components/whatsapp/whatsapp";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  Header,  Footer, Whatsapp],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Shah_Agency');
}
