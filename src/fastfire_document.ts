import firebase from "firebase";
import { FastFire } from "./fastfire";
import { DocumentFields, ReferenceClassMap } from "./types";

export class FastFireDocument<T> {

  static referenceClassMaps: { [key: string]: ReferenceClassMap } = {}

  static get collection(): firebase.firestore.CollectionReference {
    return FastFire.firestore.collection(this.name)
  }

  // id is a firestore document id
  public id: string

  constructor(id: string) {
    this.id = id
  }

  static get referenceClassMap(): ReferenceClassMap {
    return FastFireDocument.referenceClassMaps[this.name]
  }

  get reference(): firebase.firestore.DocumentReference {
    return FastFire.firestore.collection(this.constructor.name).doc(this.id)
  }

  async update(fields: DocumentFields<T>) {
    await this.reference.update(fields)
  }

  // async preload(referenceFields: Extract<keyof T, keyof FastFireReference<any>>[]) {
  //   for (const field of referenceFields) {
  //     const descriptor = Object.getOwnPropertyDescriptor(this, field)
  //     if (!descriptor || !descriptor.writable) continue
  //     // @ts-ignore
  //     this[field] = "hoge"
  //   }
  // }

  async preload(referenceFields: (keyof T)[]) {
    for (const field of referenceFields) {
      const descriptor = Object.getOwnPropertyDescriptor(this, field)
      if (!descriptor || !descriptor.writable) continue
      // @ts-ignore
      this[field] = "hoge"
    }
  }
}
