import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMainNavComponent } from '../components/top-main-nav/top-main-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopMainNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
