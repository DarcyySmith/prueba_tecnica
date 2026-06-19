import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, logOutOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, RouterOutlet, CommonModule],
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
