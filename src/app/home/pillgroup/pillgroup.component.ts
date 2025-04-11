import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pillgroup',
  imports: [CommonModule],
  templateUrl: './pillgroup.component.html',
  styleUrl: './pillgroup.component.scss'
})
export class PillgroupComponent {
  links = [
    { title: 'Link 1', link: 'https://angular.dev' },
    { title: 'Link 2', link: 'https://angular.dev/tutorials' },
    { title: 'Link 3', link: 'https://angular.dev/tools/cli' },
  ]
}
