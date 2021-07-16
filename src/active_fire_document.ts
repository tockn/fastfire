import firebase from "firebase";
import { ActiveFire } from "./active_fire";

export class ActiveFireDocument {

  static get collection(): firebase.firestore.CollectionReference {
    return ActiveFire.firestore.collection(this.name)
  }

  // id is a firestore document id
  public id: string

  constructor(id: string) {
    this.id = id
  }

  get reference(): firebase.firestore.DocumentReference {
    return ActiveFire.firestore.collection(this.constructor.name).doc(this.id)
  }

  async update(data: firebase.firestore.DocumentData) {
    await this.reference.update(data)
  }
}
