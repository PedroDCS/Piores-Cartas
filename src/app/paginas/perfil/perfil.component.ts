import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: any = null;
  aux: any = null;

  constructor(private fb: FirebaseService, private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.talogado()) {
      this.getuserdados();
    }
  }

  salvardados() {
    let data = this.usuario
    data.nomeusuario = (<HTMLSelectElement>document.getElementById("nomedeusuario")).value
    this.fb.firestoreupdatedata("Usuarios", this.usuario.email, data).then(() => {
      this.router.navigate(['/'])
    })
  }

  getuserdados() {
    this.fb.firestoregetdata("Usuarios", String(this.authservice.get_estado_Auth().email))
      .subscribe(doc => (this.usuario = doc.payload.data()));
  }

  talogado() {
    if (!this.authservice.usuario_logado_email) {
      this.router.navigate(['/login'])
      return false
    } else {
      return true
    }
  }

}
