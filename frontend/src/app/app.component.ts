import { Component, inject, type OnInit } from '@angular/core';
import { HealthService } from './health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly health = inject(HealthService);

  get statusMessage(): string {
    const state = this.health.state();
    return state === 'online'
      ? 'API and database are ready.'
      : state === 'offline'
        ? 'Could not reach the API. Check that services are running.'
        : 'Connecting to campus services…';
  }

  ngOnInit(): void {
    this.health.check();
  }
}