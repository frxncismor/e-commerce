import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  session = this.auth.session;

  constructor(private readonly auth: AuthService) { }

  ngOnInit() {
    this.auth.authChanges((_, session) => this.session = session);
  }
}
