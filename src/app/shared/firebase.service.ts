import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }



  firestoresetdata(colection: string, doc: string, data: any) {
    return this.firestore.collection(colection).doc(doc).set(data);
  }

  firestoreupdatedata(colection: string, doc: string, data: any) {
    return this.firestore.collection(colection).doc(doc).update(data);
  }

  /*
      this.firestore.collection("CursosOnline").doc(this.cursoid).update({ alunos: this.curso.alunos });
  */

  firestoregetdata(colection: string, doc: string) {
    return this.firestore.collection(colection).doc(doc).snapshotChanges()
  }

  firestoregetcolec(colection: string) {
    return this.firestore.collection(colection).snapshotChanges()
  }

  /*
  createCoffeeOrder(data) {
    return new Promise<any>((resolve, reject) =>{
        this.firestore
            .collection("coffeeOrders")
            .add(data)
            .then(res => {}, err => reject(err));
    });
}

  getCoffeeOrders() { 
    return 
     this.firestore.collection("coffeeOrders").snapshotChanges();
  }

  */





}
