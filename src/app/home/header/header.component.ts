import { Component } from '@angular/core';
import { LogoComponent } from '../../shared/logo/logo.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [LogoComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title = 'Wastefull';
}
