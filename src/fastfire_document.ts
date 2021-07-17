import firebase from "firebase";
import { FastFire } from "./fastfire";
import { DocumentFields, ReferenceClassMap } from "./types";
import { FastFireReference } from "./fastfire_reference";

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
    if (!FastFireDocument.referenceClassMaps[this.name]) FastFireDocument.referenceClassMaps[this.name] = {}
    return FastFireDocument.referenceClassMaps[this.name]
  }

  get reference(): firebase.firestore.DocumentReference {
    return FastFire.firestore.collection(this.constructor.name).doc(this.id)
  }

  async update(fields: DocumentFields<T>) {
    await this.reference.update(fields)
  }

  async preload(referenceFields: (keyof T)[]) {
    for (const field of referenceFields) {
      const descriptor = Object.getOwnPropertyDescriptor(this, field)
      if (!descriptor) {
        throw new PreloadError(`${this.constructor.name} does not have property "${field}"`)
      }
      if (!descriptor.writable || !(descriptor.value instanceof FastFireReference)) {
        throw new PreloadError(`${this.constructor.name}.${field} is not FastFireReference`)
      }
      await descriptor.value.load()
    }
  }
}

class PreloadError extends Error {}
