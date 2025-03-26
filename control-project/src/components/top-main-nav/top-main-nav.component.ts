import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserAuthComponent } from "../user-auth/user-auth.component";
import { AuthService } from '../../services/auth.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-top-main-nav',
  standalone: true,
  imports: [MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatCardModule, UserAuthComponent],
  templateUrl: './top-main-nav.component.html',
  styleUrl: './top-main-nav.component.css'
})
export class TopMainNavComponent {
public userAuth=inject(AuthService);
}
