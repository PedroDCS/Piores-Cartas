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

  admin: boolean = false;
  jafoi: number = 0;
  constructor(private authservice: AuthService, private firestore: AngularFirestore, private fb: FirebaseService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.auth = this.authservice.authState

    this.parametro = this.activatedRoute.snapshot.paramMap.get('parametro');
    if (this.parametro == null || this.parametro == undefined || this.parametro == '') {
      this.router.navigate(['/'])
    }
    //console.log(this.parametro);
    if (this.talogado()) {
      this.fb.firestoregetdata("Salas", String(this.parametro)).subscribe(doc => (this.gerenciarsala(doc.payload.data())))
    }

  }

  testar(formdata: any) {
    console.log("Testar -------------------------------");
    console.log(formdata.value);


  }

  iniciar(formdata: any) {
    console.log("--------------");
    this.cartasbrancas = []
    this.cartaspretas = []

    //console.log(formdata.value);
    console.log(this.jogo);
    //console.log(this.pacotes);

    for (let index = 0; index < this.pacotes.length; index++) {
      const element = this.pacotes[index].payload.doc.data();
      if (formdata.value[element.packid]) {
        Array.prototype.push.apply(this.cartasbrancas, element.cartasbrancas);
        Array.prototype.push.apply(this.cartaspretas, element.cartaspretas);
      }
    }

    this.jogo.chefao = this.jogo.jogadores.shift()
    this.jogo.jogadores.push(this.jogo.chefao)


    this.jogo.cartasbrancas = this.cartasbrancas
    this.jogo.cartaspretas = this.cartaspretas.sort(() => Math.random() - 0.5)
    this.jogo.gamestart = 1
    this.jogo.cartapreta = ''
    this.jogo.cartasbrancasrodada = []

    console.log(this.jogo);
    this.firestore.collection("Salas").doc(String(this.parametro)).update(this.jogo).then(() => {

      this.router.navigate(['/jogo/' + this.parametro])
      return
    });




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
      this.fb.firestoregetdata("Usuarios", String(this.auth.email)).subscribe(doc => {
        this.jogador = doc.payload.data()

        if (data.jogadores.indexOf(String(this.jogador.nomeusuario)) == -1) {
          data.jogadores.push(String(this.jogador.nomeusuario))
          this.firestore.collection("Salas").doc(String(this.parametro)).update({ jogadores: data.jogadores });
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
    if (this.authservice.isUserEmailLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
