import firebase from "firebase";
import { FastFireDocument } from "./fastfire_document";
import { FastFire } from "./fastfire";

export class FastFireReference<T extends FastFireDocument<T>> {
  reference: firebase.firestore.DocumentReference

  constructor(reference: firebase.firestore.DocumentReference) {
    this.reference = reference
  }

  async find(): Promise<T | null> {
    const snapshot = await this.reference.get()
    return FastFire.fromSnapshot<T>(snapshot)
  }
}
