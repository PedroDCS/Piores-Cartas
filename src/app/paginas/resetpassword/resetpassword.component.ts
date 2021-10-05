import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { takeUntil } from 'rxjs/operators';

export class UserManagementActions {
  static resetPassword = 'resetPassword';
  static verifyEmail = 'verifyEmail';
  static recoverEmail = 'recoverEmail';
}

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  //Codigo baseado no repositorio
  //https://c-innovative.medium.com/implementing-password-reset-can-be-a-tricky-but-inevitable-task-737badfb7bab
  ngUnsubscribe: Subject<any> = new Subject<any>();
  actions = UserManagementActions;
  mode: any;
  actionCode: any;
  newPassword: any;
  confirmPassword: any;
  actionCodeChecked: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      let parametros: any = params;
      if (!params) this.router.navigate(['/']);

      this.mode = parametros['mode'];
      this.actionCode = parametros['oobCode'];

      switch (parametros['mode']) {
        case UserManagementActions.resetPassword: {
          this.authService.getAuth().verifyPasswordResetCode(this.actionCode).then(() => {
            this.actionCodeChecked = true;
          }).catch(e => {
            alert(e);
            this.router.navigate(['/login']);
          });
        } break
        default: {
          this.router.navigate(['/login']);
        }
      }
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  handleResetPassword() {
    if (this.newPassword != this.confirmPassword) {
      alert('Senha e Senha de verificação não são iguais');
      return;
    }
    this.authService.getAuth().confirmPasswordReset(
      this.actionCode,
      this.newPassword
    ).then(resp => {
      alert('Nova Senha criada com sucesso, agora é só entrar na sua conta!');
      this.router.navigate(['/login']);
    }).catch(e => {
      alert(e);
    });
  }

}