import { Component } from '@angular/core';


@Component({
  selector: 'app-pillgroup',
  imports: [],
  templateUrl: './pillgroup.component.html',
  // styleUrl: './pillgroup.component.scss',
})
export class PillgroupComponent {
  links = [{ title: 'Wastefull', link: 'https://wastefull.org' }];
}
