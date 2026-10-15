import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Owner } from '../../shared/owner/owner';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Owner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
})
export class Home {
  readonly currentYear = new Date().getFullYear();
}
