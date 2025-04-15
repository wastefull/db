import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import { ObjectService } from '../../object.service';
import { Object } from '../../object';

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
    route: ActivatedRoute = inject(ActivatedRoute);
    objectId: number = -1;
    constructor() {
      this.objectId = Number(this.route.snapshot.params['id']);
    }
}
