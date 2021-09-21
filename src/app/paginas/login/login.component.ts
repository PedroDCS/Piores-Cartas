import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = "";
  password = "";
  errorMessage = ''; // validation error handle

  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle

  constructor( private authservice: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.talogado()
  }


  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  talogado() {
    if (this.authservice.isUserEmailLoggedIn) {
      this.router.navigate(['/'])
      return true
    } else {
      return false
    }
  }

  login(formData: any) {
    if (formData.valid) {
      this.authservice.loginWithEmail(formData.value)
        .then(() => {
          //this.firebase.setUsuariotemp(this.email);
          this.router.navigate(['/'])
        }).catch(_error => {
          this.error = _error
          alert("Dados Incorretos");
          this.router.navigate(['/login'])
        })
    }
    
    /*
this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice.loginWithEmail(this.email, this.password)
        .then(() => {
          //this.firebase.setUsuariotemp(this.email);
          this.router.navigate(['/area-usuario'])
        }).catch(_error => {
          this.error = _error
          alert("Dados Incorretos");
          this.router.navigate(['/login'])
        })
    }
    */
  }



  resetpassword() {

    this.authservice.resetarsenha((<HTMLSelectElement>document.getElementById('exampleInputEmail1')).value)
      .then(() => {
        //document.getElementById('modal1').click()
        //document.getElementById('modalsucesso').click()

      }).catch(_error => {
        this.error = _error
        alert("Email Incorreto, Não Existe Cadastro com esse email");
        this.router.navigate(['/login'])
      })
  }

  validateForm(email: string, password: string) {
    if (email.length == 0) {
      this.errorMessage = "Informe um email";
      return false;
    }
    if (password.length == 0) {
      this.errorMessage = "Insira a senha";
      return false;
    }
    if (password.length < 4) {
      this.errorMessage = "Senha muito curta";
      return false;
    }
    this.errorMessage = '';
    return true;
  }

}
