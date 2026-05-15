import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pixel-character',
  imports: [],
  templateUrl: './character.html',
  styleUrl: './character.css',
})
export class CharacterComponent {
   headColor = input.required<string>();
  bodyColor = input.required<string>();
  label      = input<string>('pixel character');


}
