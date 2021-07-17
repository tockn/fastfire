import firebase from "firebase";
import { FastFireDocument } from "./fastfire_document";
import { FastFire } from "./fastfire";
import { IDocumentClass } from "./types";

export class FastFireReference<T extends FastFireDocument<T>> {
  documentClass: IDocumentClass<T>
  reference: firebase.firestore.DocumentReference

  constructor(
    documentClass: IDocumentClass<T>,
    reference: firebase.firestore.DocumentReference
  ) {
    this.documentClass = documentClass
    this.reference = reference
  }

  async find(): Promise<T | null> {
    const snapshot = await this.reference.get()
    return FastFire.fromSnapshot<T>(this.documentClass, snapshot)
  }
}

// export const reference = (): (target: any, propertyKey: string, descriptor: PropertyDecorator) => any => {
//   return <T>(target: T, propertyKey: string, descriptor: PropertyDecorator): T => {
//     console.log(target, propertyKey, descriptor)
//     return target
//   }
// }

export const reference = <T>(documentClass: IDocumentClass<T>) => {
  return (target: any, propertyKey: string) => {
    const documentName = target.constructor.name
    if (!FastFireDocument.referenceClassMaps[documentName]) FastFireDocument.referenceClassMaps[documentName] = {}
    FastFireDocument.referenceClassMaps[documentName][propertyKey] = documentClass
  }
}
