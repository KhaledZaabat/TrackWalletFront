import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gameCoins } from '@ng-icons/game-icons';
import { provideIcons } from '@ng-icons/core';
import { CharacterComponent } from './character/character';

@Component({
  selector: 'app-home',
  imports: [RouterLink ,CharacterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
   viewProviders: [provideIcons({ gameCoins, })]

})
export class Homecomponent {

readonly party = signal([
  { headColor: '#FFD700', bodyColor: '#BD93F9', label: 'Warrior'  },
  { headColor: '#BD93F9', bodyColor: '#00D4FF', label: 'Mage'     },
  { headColor: '#39FF14', bodyColor: '#FFB800', label: 'Rogue'    },
]);

}
