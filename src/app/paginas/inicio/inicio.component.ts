import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {

  user: any = null;

  constructor(private authservice: AuthService, private router: Router, private fb: FirebaseService) { }

  ngOnInit(): void {
    this.talogado()
  }

  entrarsala() {
    this.router.navigate(['/sala/' + (<HTMLSelectElement>document.getElementById("codsala")).value]);
  }

  criarsala(tiposala: number) {

    let datasala = {
      host: this.user.email,
      sala: this.user.nomeusuario,
      tipodesala: tiposala,
      jogadores: [this.user.nomeusuario],
      gamestart: 0,
      rodada: 0
    };

    try {
      this.fb.firestoresetdata('Salas', String(this.user.nomeusuario), datasala).then(() => {
        this.router.navigate(['sala/' + this.user.nomeusuario]);
      });
    } catch (error) {
      alert('Ops, deu errado, tenta ai de novo');
      alert(error);
    }
  }

  talogado() {
    if (this.authservice.usuario_logado_email) {
      this.fb.firestoregetdata('Usuarios', this.authservice.get_estado_Auth().email)
        .subscribe((doc) => (this.user = doc.payload.data()));
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
