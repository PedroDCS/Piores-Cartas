import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FirebaseService } from "./shared/firebase.service";
import { environment } from "src/environments/environment";


import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";

import { FooterComponent } from './shared/footer/footer.component';
import { PrincipalComponent } from './jogo/principal/principal.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegisterComponent } from './paginas/register/register.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { CriarpackComponent } from './paginas/criarpack/criarpack.component';
import { FormsModule } from '@angular/forms';
import { SalaComponent } from './jogo/sala/sala.component';
import { ResetpasswordComponent } from './paginas/resetpassword/resetpassword.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    PrincipalComponent,
    InicioComponent,
    LoginComponent,
    RegisterComponent,
    PerfilComponent,
    CriarpackComponent,
    SalaComponent,
    ResetpasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
