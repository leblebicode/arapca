import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_VERSION } from './version';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly version = APP_VERSION;
}
