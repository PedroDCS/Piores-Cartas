import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './jogo/principal/principal.component';
import { SalaComponent } from './jogo/sala/sala.component';
import { CriarpackComponent } from './paginas/criarpack/criarpack.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { RegisterComponent } from './paginas/register/register.component';
import { ResetpasswordComponent } from './paginas/resetpassword/resetpassword.component';

const routes: Routes = [
  {
    path: "",
    component: InicioComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "registro",
    component: RegisterComponent
  },
  {
    path: 'resetpassword',
    component: ResetpasswordComponent
  },
  {
    path: "perfil",
    component: PerfilComponent
  },
  {
    path: "criarpack",
    component: CriarpackComponent
  },
  {
    path: "sala/:parametro",
    component: SalaComponent
  },
  {
    path: "jogo/:parametro",
    component: PrincipalComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
