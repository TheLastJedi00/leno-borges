import { Component } from '@angular/core';
import { Header } from "../../shared/header/header";
import { GrowUp } from "../../shared/grow-up/grow-up";

@Component({
  selector: 'app-landing',
  imports: [Header, GrowUp],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
