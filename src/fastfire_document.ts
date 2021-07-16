import firebase from "firebase";
import { FastFire } from "./fastfire";

export class FastFireDocument {

  static get collection(): firebase.firestore.CollectionReference {
    return FastFire.firestore.collection(this.name)
  }

  // id is a firestore document id
  public id: string

  constructor(id: string) {
    this.id = id
  }

  get reference(): firebase.firestore.DocumentReference {
    return FastFire.firestore.collection(this.constructor.name).doc(this.id)
  }

  async update(data: firebase.firestore.DocumentData) {
    await this.reference.update(data)
  }
}
