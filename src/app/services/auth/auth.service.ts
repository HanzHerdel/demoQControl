import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
export interface User{
  tipo:string,
  sueprUser:boolean,
  nombre:string,
  telefono:string
  }
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth:any;//info auth
  public usuario:any;//usuario 
usersCollection: Observable<User[]>;
  constructor(private firebaseAuth: AngularFireAuth, db: AngularFirestore
) {
// evento de autentificacion bilateral dijera xD
//this.usersCollection= db.collection<User>('users');
    this.firebaseAuth.authState.subscribe((auth) => {
              this.auth = auth;
            });
}

    /************************ configuracion de logeo y usuarios *//////////////
	getSubscriptionAuth(){
	return  this.firebaseAuth.authState;
	}
 	public getUsuario(id:string=""){
 	//	return this.usersCollection.doc(id).valueChanges();
 	}
  public buscarUsuarioCorreo(correo){
  //  return this.db.collection('users', ref => ref.where('correo', '==',correo)).snapshotChanges()
      /*then(docSnapshot => {
        if (docSnapshot.exists) {
          // do something
        }*/
  }
  public getEmpresaUsuario(id){
   // return this.db.collection('empresas').doc(id).valueChanges();    
  }
	login(email: string="", password: string=""){
    return this.firebaseAuth
      .auth.signInWithEmailAndPassword(email, password);
  	}

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }
}
