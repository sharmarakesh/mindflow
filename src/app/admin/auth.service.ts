import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseError, User } from 'firebase/app';

@Injectable()
export class AuthService {
  public authId: string;
  public redirectUrl: string;
  constructor(private afAuth: AngularFireAuth) { }

  public login(email: string, password: string): Promise<User> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public register(email: string, name: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user: User) => {
          user.updateProfile({
            displayName: name,
            photoURL: ''
          })
            .then((user: User) => resolve(user))
            .catch((err: FirebaseError) => reject(err));
        })
        .catch((err: FirebaseError) => reject(err));
    })
  }

  public reqestReset(email: string): Promise<void> {
      return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
