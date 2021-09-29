import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState: any = null;

  constructor(private afu: AngularFireAuth, private router: Router) {
    this.afu.authState.subscribe((auth => {
      this.authState = auth;
    }))
  }

  // all firebase getdata functions

  get isUserAnonymousLoggedIn(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false
  }

  get currentUserId(): string {
    return (this.authState !== null) ? this.authState.uid : ''
  }

  get currentUserName(): string {
    if (this.authState == null) {
      return "";
    } else {
      return this.authState['email']
    }

  }

  get currentUser(): any {
    return (this.authState !== null) ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if ((this.authState !== null) && (!this.isUserAnonymousLoggedIn)) {
      return true
    } else {
      return false
    }
  }

  registerWithEmail(data: any) {
    return this.afu.createUserWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        this.authState = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  getAuth() {
    return this.afu;
  }

  resetarsenha(emailAddress: string) {
    return this.afu.sendPasswordResetEmail(emailAddress).then(function () {
      // Email sent.
    }).catch(error => {
      console.log(error)
      throw error
    });
  }

  loginWithEmail(data: any) {
    return this.afu.signInWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        this.authState = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  singout(): void {
    this.afu.signOut().then(() => {
      this.router.navigate(['/login']);
    });

  }

}
