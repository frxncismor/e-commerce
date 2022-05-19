import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;

  constructor(private readonly auth: AuthService) { }

  ngOnInit(): void {
    
  }

  async handleLogin(input: string) {
    try {
      this.loading = true;
      await this.auth.signIn(input);
      alert('¡Revisa tu email para el enlace mágico!');
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      this.loading = false;
    }
  }

}
