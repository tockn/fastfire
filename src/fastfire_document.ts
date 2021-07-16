import firebase from "firebase";
import { FastFire } from "./fastfire";
import { DocumentFields } from "./types";

export class FastFireDocument<T> {

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

  async update(fields: DocumentFields<T>) {
    await this.reference.update(fields)
  }
}
