import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-socials',
  imports: [IonicModule],
  templateUrl: './socials.component.html',
})
export class SocialsComponent {
  ghlink = 'https://github.com/wastefull/db';
  discordlink = 'https://discord.gg/NV9fhyRAg4';
  instagramlink = 'https://www.instagram.com/wastefullorg/';
}
