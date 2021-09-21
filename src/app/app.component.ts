import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Piores Cartas';

  constructor(private authservice: AuthService, private router: Router) { }
  ngOnInit(): void {
    //this.talogado()
  }
  talogado() {
    if (this.authservice.isUserEmailLoggedIn) {
      this.router.navigate(['/'])
      return true
    } else {
      this.router.navigate(['/login'])
      return false
    }
  }
}
