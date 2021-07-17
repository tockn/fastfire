import firebase from "firebase";
import { WhereChain } from "./where_chain";
import { DocumentFields, IDocumentClass, IDocument } from "./types";
import { FastFireDocument } from "./fastfire_document";
import { FastFireReference } from "./fastfire_reference";

export abstract class FastFire {

  static firestore: firebase.firestore.Firestore

  static initialize(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore
  }

  static async create<T extends IDocument>(
    documentClass: IDocumentClass<T>,
    fields: DocumentFields<T>
  ): Promise<T> {
    for (const key of (Object.keys(fields) as (keyof DocumentFields<T>)[])) {
      if (!(fields[key] as any instanceof FastFireDocument)) continue
      fields[key] = (fields[key] as unknown as FastFireDocument<T>).reference
    }
    const docRef = await this.firestore.collection(documentClass.name).add(fields)
    const doc = await docRef.get()
    return this.fromSnapshot(documentClass, doc) as T
  }

  static async findById<T extends IDocument>(
    documentClass: IDocumentClass<T>,
    id: string
  ): Promise<T | null> {
    const doc = await this.firestore.collection(documentClass.name).doc(id).get()
    return this.fromSnapshot<T>(documentClass, doc)
  }

  static where<T extends IDocument>(
    documentClass: IDocumentClass<T>,
    fieldPath: keyof T | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: any
  ): WhereChain<T> {
    const query = this.firestore.collection(documentClass.name).where(fieldPath as string, opStr, value)
    return new WhereChain(documentClass, query)
  }

  static async all<T extends IDocument>(
    documentClass: IDocumentClass<T>,
  ): Promise<T[]> {
    const snapshots = await this.firestore.collection(documentClass.name).get()
    const results: T[] = []
    snapshots.forEach((snapshot) => {
      const data = this.fromSnapshot<T>(documentClass, snapshot)
      if (!data) return
      results.push(data)
    })
    return results
  }

  // static fromSnapshot<T extends IDocument>(
  //   snapshot: firebase.firestore.DocumentSnapshot
  // ): T | null {
  //   if (!snapshot.exists) return null
  //   const obj = { id: snapshot.id } as T
  //
  //   const data = snapshot.data() as never
  //   const keys = Object.keys(data) as never[]
  //   for (const key of keys) {
  //     if (data[key] as any instanceof firebase.firestore.DocumentReference) {
  //       obj[key] = new FastFireReference(data[key]) as never
  //     } else {
  //       obj[key] = data[key] as never
  //     }
  //   }
  //   return obj
  // }

  static fromSnapshot<T extends IDocument>(
    documentClass: IDocumentClass<T>,
    snapshot: firebase.firestore.DocumentSnapshot
  ): T | null {
    if (!snapshot.exists) return null
    const obj = new documentClass()

    const data = snapshot.data() as never
    const keys = Object.keys(data) as never[]
    for (const key of keys) {
      if (data[key] as any instanceof firebase.firestore.DocumentReference) {
        obj[key] = new FastFireReference(documentClass.referenceClassMap[key], data[key]) as never
      } else {
        obj[key] = data[key] as never
      }
    }
    return obj
  }
}

// this.nameでset, get作っていい感じにできないか考える
