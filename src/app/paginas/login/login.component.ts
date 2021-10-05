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
  errorMessage = ''; // error

  error: { name: string, message: string } = { name: '', message: '' }; //firebase

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.talogado()
  }


  limpar_mensagens_erro() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  talogado() {
    if (this.authservice.usuario_logado_email) {
      this.router.navigate(['/'])
      return true
    } else {
      return false
    }
  }

  login(formData: any) {
    this.limpar_mensagens_erro()
    if (formData.valid && this.validar_formulario(formData.valid)) {
      this.authservice.login_com_email(formData.value).then(() => {
        this.router.navigate(['/'])
      }).catch(_error => {
        this.error = _error
        alert("Dados Incorretos");
        this.router.navigate(['/login'])
      })
    }
  }


  resetar_senha() {
    this.authservice.resetar_senha((<HTMLSelectElement>document.getElementById('emailresetar_senha')).value)
      .then(() => {
        alert("Email de recuperação enviado, cheque sua caixa de entrada");
        (<HTMLSelectElement>document.getElementById("fecharmodal")).click()
      }).catch(_error => {
        this.error = _error
        alert("Email Incorreto, Não Existe Cadastro com esse email");
        this.router.navigate(['/login'])
      })
  }


  validar_formulario(data: any) {
    if (String(data.email).length == 0) {
      this.errorMessage = "Informe um email";
      return false;
    }
    if (String(data.password).length == 0) {
      this.errorMessage = "Insira a senha";
      return false;
    }
    if (String(data.password).length < 4) {
      this.errorMessage = "Senha muito curta";
      return false;
    }
    this.errorMessage = '';
    return true;
  }

}
