import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {

  jogo: any = null;
  jogador: any = null
  parametro: any = null
  pacotes: any = null
  auth: any = null
  cartasbrancas: any = []
  cartaspretas: any = []
  jogadores: any = []
  jogadorespontos: any = []
  admin: boolean = false;
  jafoi: number = 0;


  constructor(private authservice: AuthService, private firestore: AngularFirestore, private fb: FirebaseService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.auth = this.authservice.estado_Auth

    this.parametro = this.activatedRoute.snapshot.paramMap.get('parametro');
    if (this.parametro == null || this.parametro == undefined || this.parametro == '') {
      this.router.navigate(['/'])
    }

    if (this.talogado()) {
      this.fb.firestoregetdata("Salas", String(this.parametro)).subscribe(doc => (this.gerenciarsala(doc.payload.data())))
    }

  }


  iniciar(formdata: any) {

    var seguir: boolean = false

    this.cartasbrancas = []
    this.cartaspretas = []

    for (let index = 0; index < this.pacotes.length; index++) {
      const element = this.pacotes[index].payload.doc.data();
      if (formdata.value[element.packid]) {
        Array.prototype.push.apply(this.cartasbrancas, element.cartasbrancas);
        Array.prototype.push.apply(this.cartaspretas, element.cartaspretas);
        seguir = true
      }
    }

    if (seguir == false) {
      alert("Selecione ao menos um pack de cartas!");
      return
    }

    /*
  this.jogo.chefao = this.jogo.jogadores.shift()
  this.jogo.jogadores.push(this.jogo.chefao)
 
  this.jogo.cartasbrancas = this.cartasbrancas.sort(() => Math.random() - 0.5)
  this.jogo.cartaspretas = this.cartaspretas.sort(() => Math.random() - 0.5)
  this.jogo.gamestart = 1
 
  this.jogo.limitepontos = Number((<HTMLSelectElement>document.getElementById("limitepontos")).value)
  this.jogo.cartapreta = ''
  this.jogo.cartasbrancasrodada = []
 
 
  console.log(this.jogo);
*/

    let datasala = {
      host: this.jogador.email,
      sala: this.jogador.nomeusuario,
      tipodesala: 1,
      jogadores: this.jogadores,
      gamestart: 1,
      rodada: 0,
      chefao: this.jogo.jogadores[0],
      cartasbrancas: this.cartasbrancas.sort(() => Math.random() - 0.5),
      cartaspretas: this.cartaspretas.sort(() => Math.random() - 0.5),
      limitepontos: Number((<HTMLSelectElement>document.getElementById("limitepontos")).value),
      cartapreta: '',
      cartasbrancasrodada: [],
      jogadorespontos: this.jogadorespontos
    };


    console.log(this.jogadorespontos);


    try {
      this.firestore.collection("Salas").doc(String(this.parametro)).update(datasala).then(() => {
        this.router.navigate(['/jogo/' + this.parametro])
        return
      });
    } catch (error) {
      alert("Ops, deu errado!")
      alert(error)
    }
    /*
    
    */


  }




  gerenciarsala(data: any) {
    if (Number(data.gamestart) == 1) {
      this.router.navigate(['/jogo/' + this.parametro])
      return
    }
    this.jogo = data
    if (this.jafoi == 0) {
      this.fb.firestoregetcolec("Pacotes").subscribe(doc => {
        this.pacotes = doc
      })

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
        for (let index = 0; index < this.jogadorespontos.length; index++) {
          if (this.jogadorespontos[index].jogador.nomeusuario == this.jogador.nomeusuario) {
            colocar = false
          }
        }

        if (colocar == true) {
          this.jogadorespontos.push(aux)
        }

        if (data.jogadores.indexOf(String(this.jogador.nomeusuario)) == -1) {
          data.jogadores.push(String(this.jogador.nomeusuario))
          this.jogadores.push(String(this.jogador.nomeusuario))
          this.firestore.collection("Salas").doc(String(this.parametro)).update({ jogadorespontos: this.jogadorespontos, jogadores: data.jogadores });
        }

        if (String(this.jogador.email) == String(this.jogo.host)) {
          this.admin = true
        }
      })

      this.jafoi = 1
    } else {
      //console.log(1);
    }
  }

  talogado() {
    if (this.authservice.usuario_logado_email) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
