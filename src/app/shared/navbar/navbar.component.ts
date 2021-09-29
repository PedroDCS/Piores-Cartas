import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout() {

    this.authservice.singout();
    setTimeout(() => {
      this.router.navigate(['/login'])

    }, 2000);
  }

}
