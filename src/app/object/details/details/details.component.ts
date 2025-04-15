import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import { ObjectService } from '../../object.service';
import { Object } from '../../object';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
    route: ActivatedRoute = inject(ActivatedRoute);
    objectService: ObjectService = inject(ObjectService);
    object: Object | undefined;

    public handleMissingImage($event: ErrorEvent) {
        let target = $event.target as HTMLImageElement;
        target.src = this.badImage();
    }
    public badImage(): string {
        return environment.thumbs_api + 'sample.png';
    }

    constructor() {
    const objectId = this.route.snapshot.params['id'];
    this.object = this.objectService.getObjectById(objectId);
    if (!this.object) {
        console.error('Object not found');
        this.object = {
            id: "0",
            name: "Unknown",
            altNames: [],
            thumbnail: this.badImage(),
            tags: [],
            shortname: "Unknown"
        };
        return; 
    }
}
}
