import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { HeaderComponent } from './home/header/header.component';
import { PillgroupComponent } from './home/pillgroup/pillgroup.component';
import { SocialsComponent } from './shared/socials/socials.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SearchComponent, PillgroupComponent, SocialsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Wastefull';
}
