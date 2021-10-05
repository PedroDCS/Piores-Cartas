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
  errorMessage = ''; //error

  error: { name: string, message: string } = { name: '', message: '' }; //firebase

  constructor(private authservice: AuthService, private router: Router, private fb: FirebaseService) { }
  ngOnInit(): void {
  }

  limpar_mensagens_erro() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  registrar(formData: any) {
    this.limpar_mensagens_erro();
    if (this.validar_formulario(formData.value)) {
      this.authservice.registrar_com_email(formData.value).then(() => {
        this.criar_usuario(formData.value.email);
        this.router.navigate(['/perfil'])
      }).catch(_error => {
        this.error = _error
        alert("Ops, algo não esta certo, tente novamente")
        this.router.navigate(['/registro'])
      })
    }
  }

  criar_usuario(email: any) {
    let usuario = {
      'email': email,
      'data': new Date().getTime()
    }

    try {
      this.fb.firestoresetdata("Usuarios", String(email), usuario);
    } catch (error) {

    }
  }


  talogado() {
    if (this.authservice.usuario_logado_email) {
      this.router.navigate(['/perfil'])
      return true
    } else {
      return false
    }
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
