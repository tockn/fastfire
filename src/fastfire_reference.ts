import firebase from "firebase";
import { FastFireDocument } from "./fastfire_document";
import { FastFire } from "./fastfire";
import { IDocumentClass } from "./types";

export class FastFireReference<T extends FastFireDocument<T>> {
  documentClass: IDocumentClass<T>
  reference: firebase.firestore.DocumentReference
  loaded: boolean

  private loadedData!: T

  get data(): T {
    if (!this.loaded) throw new ReferenceUnloadError(this.documentClass.name)
    return this.loadedData
  }

  constructor(
    documentClass: IDocumentClass<T>,
    reference: firebase.firestore.DocumentReference
  ) {
    this.documentClass = documentClass
    this.reference = reference
    this.loaded = false
  }

  async load(): Promise<T | null> {
    const snapshot = await this.reference.get()
    const d = FastFire.fromSnapshot<T>(this.documentClass, snapshot)
    if (d) {
      this.loaded = true
      this.loadedData = d
    }
    return d
  }
}

class ReferenceUnloadError extends Error {
  constructor(documentName: string) {
    super(`FastFireReference ${documentName} is not loaded.
Use load() method or preload() method in parent FastFireDocument class.`);
  }
}

export const Reference = <T>(documentClass: IDocumentClass<T>) => {
  return (target: any, propertyKey: string) => {
    const documentName = target.constructor.name
    if (!FastFireDocument.referenceClassMaps[documentName]) FastFireDocument.referenceClassMaps[documentName] = {}
    FastFireDocument.referenceClassMaps[documentName][propertyKey] = documentClass
  }
}
