import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email = '';
  password = '';
  errorMessage = ''; // validation error handle

  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle

  constructor(private authservice: AuthService, private router: Router, private fb: FirebaseService) { }
  ngOnInit(): void {
  }

  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  register(formData: any) {
    console.log(formData.value);
    this.clearErrorMessage();
    if (this.validateForm(formData.value)) {
      this.authservice.registerWithEmail(formData.value)
        .then(() => {          
          this.criarusuario(formData.value.email);
          this.router.navigate(['/perfil'])
        }).catch(_error => {
          this.error = _error
          this.router.navigate(['/registro'])
        })
    }
  }

  criarusuario(email: any) {
    let aux = {
      'email': email,
      'data': new Date().getTime()
    }

    try {
      this.fb.firestoresetdata("Usuarios", String(email), aux);
    } catch (error) {

    }
  }


  talogado() {
    if (this.authservice.isUserEmailLoggedIn) {
      this.router.navigate(['/perfil'])
      return true
    } else {
      return false
    }
  }

  validateForm(data: any) {
    if (data.email == 0) {
      this.errorMessage = "Informe um email";
      return false;
    }
    if (data.password.length == 0) {
      this.errorMessage = "Insira a senha";
      return false;
    }
    if (data.password.length < 4) {
      this.errorMessage = "Senha muito curta";
      return false;
    }
    this.errorMessage = '';
    return true;

  }

}
