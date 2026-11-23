import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

interface HealthResponse { status: string; database: string }

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);
  readonly state = signal<'checking' | 'online' | 'offline'>('checking');
  check(): void {
    this.http.get<HealthResponse>('/api/health').subscribe({
      next: () => this.state.set('online'), error: () => this.state.set('offline')
    });
  }
}
