import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pillgroup',
  imports: [CommonModule],
  templateUrl: './pillgroup.component.html',
  // styleUrl: './pillgroup.component.scss',
})
export class PillgroupComponent {
  links = [{ title: 'Wastefull', link: 'https://wastefull.org' }];
}
