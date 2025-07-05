import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-socials',
  imports: [CommonModule],
  templateUrl: './socials.component.html',
})
export class SocialsComponent {
  ghlink = 'https://github.com/wastefull/db';
  discordlink = 'https://discord.gg/NV9fhyRAg4';
  instagramlink = 'https://www.instagram.com/wastefullorg/';
}
