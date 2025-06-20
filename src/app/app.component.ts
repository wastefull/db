import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './home/header/header.component';
import { PillgroupComponent } from './home/pillgroup/pillgroup.component';
import { SocialsComponent } from './shared/socials/socials.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    PillgroupComponent,
    SocialsComponent,
    RouterModule,
    IonicModule,
  ],
  templateUrl: './app.component.html',
  // styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Wastefull';
}
