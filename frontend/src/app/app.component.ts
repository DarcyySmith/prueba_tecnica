import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, logOutOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonIcon, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(public authService: AuthService, private router: Router) {
    addIcons({ addOutline, logOutOutline });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
