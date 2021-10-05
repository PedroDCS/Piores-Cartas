import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-criarpack',
  templateUrl: './criarpack.component.html',
  styleUrls: ['./criarpack.component.css']
})
export class CriarpackComponent implements OnInit {

  nomedopack: any = ""
  descpack: any = ""
  cartaspretas: any = []
  cartaspretaNbranca: any = []
  cartasbrancas: any = []


  constructor(private fb: FirebaseService, private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.talogado()
  }

  talogado() {
    if (this.authservice.usuario_logado_email) {
      return true
    } else {
      this.router.navigate(['/login'])
      return false
    }
  }

  adicionarcarta(tipocarta: boolean) {
    if (tipocarta) {
      let aux = {
        'carta': (<HTMLSelectElement>document.getElementById("cartapreta")).value,
        'nbrancas': Number((<HTMLSelectElement>document.getElementById("numcardbranca")).value)
      }
      this.cartaspretas.push(aux);
      (<HTMLSelectElement>document.getElementById("cartapreta")).value = '';
      (<HTMLSelectElement>document.getElementById("numcardbranca")).value = '1';

    } else {
      this.cartasbrancas.push((<HTMLSelectElement>document.getElementById("cartabranca")).value);
      (<HTMLSelectElement>document.getElementById("cartabranca")).value = ''
    }
  }

  salvarpack() {
    let data = {
      'packname': (<HTMLSelectElement>document.getElementById("packname")).value,
      'packdesc': (<HTMLSelectElement>document.getElementById("packdesc")).value,
      'cartaspretas': this.cartaspretas,
      'cartasbrancas': this.cartasbrancas,
      'criador': this.authservice.estado_Auth.email,
      'packid': Math.floor(Math.random() * 10000 + 1)
    }

    try {
      this.fb.firestoresetdata("Pacotes", String(data.packname), data).then(() => {
        (<HTMLSelectElement>document.getElementById("packname")).value = '';
        (<HTMLSelectElement>document.getElementById("packdesc")).value = '';
        this.cartaspretas = []
        this.cartasbrancas = []
        this.cartaspretaNbranca = []
        alert("Pacote Salvo Com Sucesso!")
      }).catch(error => {
        alert("Ops, deu errado, tenta ai de novo")
        alert(error)
      })
    } catch (error) {
      alert("Tem alguma coisa errada ai, olha direito...")
      alert(error)
    }
  }

}
