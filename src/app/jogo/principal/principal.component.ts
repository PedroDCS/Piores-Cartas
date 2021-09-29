import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {


  jogo: any = null;
  jogador: any = null
  parametro: any = null
  auth: any = null
  cartasbrancas: any = []
  cartaspretas: any = []
  minhamao: any = []
  cartapreta: any = null
  cartabrancarodada: any = []
  podejogar: boolean = true
  index: number = -1

  admin: boolean = false;
  jafoi: boolean = false;
  chefao: boolean = false;

  constructor(private authservice: AuthService, private firestore: AngularFirestore, private fb: FirebaseService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.auth = this.authservice.authState

    this.parametro = this.activatedRoute.snapshot.paramMap.get('parametro');
    if (this.parametro == null || this.parametro == undefined || this.parametro == '') {
      this.router.navigate(['/'])
    }
    if (this.talogado()) {
      this.fb.firestoregetdata("Salas", String(this.parametro)).subscribe(doc => (this.gerenciarsala(doc.payload.data())))
    }

  }

  talogado() {
    if (this.authservice.isUserEmailLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  confirmarcarta() {
    this.cartabrancarodada.push(String(this.minhamao[this.index]))
    console.log(this.cartabrancarodada);

    if (this.index != -1) {
      this.minhamao.splice(this.index, 1)
      this.index = -1
    } else {
      alert("Selecione uma carta")
      return
    }

    if (this.cartabrancarodada.length >= this.cartapreta.nbrancas) {
      this.podejogar = false
      let data = {
        'jogador': this.jogador.nomeusuario,
        'cartabranca': this.cartabrancarodada,
      }
      this.jogo.cartasbrancasrodada.push(data)
      this.firestore.collection("Salas").doc(String(this.parametro)).update(this.jogo).then();
    }
  }

  encerrarjogadas() {
    this.jogo.rodada = 2
    this.firestore.collection("Salas").doc(String(this.parametro)).update(this.jogo);
  }

  finalizarrodada() {
    this.jogo.cartasbrancasrodada[this.index].cartabranca.push(this.jogo.cartasbrancasrodada[this.index].jogador)
    let aux = this.jogo.cartasbrancasrodada[this.index]
    this.jogo.cartasbrancasrodada = []
    this.jogo.cartasbrancasrodada.push(aux)

    this.firestore.collection("Salas").doc(String(this.parametro)).update({ cartasbrancasrodada: this.jogo.cartasbrancasrodada }).then(() => {
      setTimeout(() => {
        this.jogo.rodada = 0
        this.jogo.cartasbrancasrodada = []
        this.jogo.chefao = this.jogo.jogadores.pop()
        this.jogo.jogadores.unshift(this.jogo.chefao)

        this.firestore.collection("Salas").doc(String(this.parametro)).update(this.jogo)

      }, 5000);
    });
  }

  escolhermelhorcarta(index: number) {
    this.index = index
  }

  selecionarcartasbranca(index: number) {
    this.index = index
  }

  gerenciarsala(data: any) {
    this.jogo = data

    console.log("=================");
    if (Number(data.gamestart) == 0) {
      this.router.navigate(['/sala/' + this.parametro])
      return
    }

    this.configcartas()

    switch (data.rodada) {
      case 0:
        this.cartabrancarodada = []
        this.podejogar = true
        break;

      case 1:
        this.cartapreta = data.cartapreta
        break;

      case 2:
        this.podejogar = false
        this.cartapreta = data.cartapreta
        break;

      default:
        break;
    }

    if (this.jafoi == false) {
      var aux
      if (this.auth.email == undefined) {
        aux = this.auth.user.email
      } else {
        aux = this.auth.email
      }

      this.fb.firestoregetdata("Usuarios", String(aux)).subscribe(doc => {
        this.jogador = doc.payload.data()

        var aux = {
          jogador: doc.payload.data(),
          pontos: 0
        }

        var colocar = true
        for (let index = 0; index < data.jogadorespontos.length; index++) {
          if (data.jogadorespontos[index].jogador.nomeusuario == this.jogador.nomeusuario) {
            colocar = false
          }
        }
        if (colocar == true) {
          data.jogadorespontos.push(aux)
        }

        if (data.jogadores.indexOf(String(this.jogador.nomeusuario)) == -1) {
          data.jogadores.push(String(this.jogador.nomeusuario))
          this.firestore.collection("Salas").doc(String(this.parametro)).update({ jogadorespontos: data.jogadorespontos, jogadores: data.jogadores });
        }

        if (String(this.jogador.email) == String(this.jogo.host)) {
          this.admin = true
          if (this.jogo.rodada == 0) {
            this.configcartapreta()
          }
        }

        if (String(this.jogador.nomeusuario) == String(this.jogo.chefao)) {
          this.chefao = true
          this.podejogar = false
        } else {
          this.chefao = false
        }
      })

      this.jafoi = true
    } else {
      if (String(this.jogador.nomeusuario) == String(this.jogo.chefao)) {
        this.chefao = true
        this.podejogar = false
      } else {
        this.chefao = false
      }
    }

    if (this.admin == true && this.jogo.rodada == 0) {
      this.configcartapreta()
    }

  }

  configcartas() {
    while (this.cartasbrancas.length < 11) {
      Array.prototype.push.apply(this.cartasbrancas, this.jogo.cartasbrancas.sort(() => Math.random() - 0.5));
    }
    while (this.cartaspretas.length < 11) {
      Array.prototype.push.apply(this.cartaspretas, this.jogo.cartaspretas.sort(() => Math.random() - 0.5));
    }
    while (this.minhamao.length < 9) {
      this.minhamao.push(this.cartasbrancas.shift())
    }
  }

  configcartapreta() {
    this.cartapreta = null
    this.cartapreta = this.cartaspretas.shift()
    this.jogo.rodada = 1
    this.jogo.cartapreta = this.cartapreta
    this.firestore.collection("Salas").doc(String(this.parametro)).update({ cartapreta: this.cartapreta, rodada: 1 });
  }

}
