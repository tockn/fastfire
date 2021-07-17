import firebase from "firebase";
import { QueryChain } from "./where_chain";
import { DocumentFields, IDocumentClass, IDocument } from "./types";
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
  ): QueryChain<T> {
    const query = this.firestore.collection(documentClass.name).where(fieldPath as string, opStr, value)
    return new QueryChain(documentClass, query)
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

  static fromSnapshot<T extends IDocument>(
    documentClass: IDocumentClass<T>,
    snapshot: firebase.firestore.DocumentSnapshot
  ): T | null {
    if (!snapshot.exists) return null
    const obj = new documentClass(snapshot.id)

    const data = snapshot.data() as never
    const keys = Object.keys(data) as never[]
    for (const key of keys) {
      if (data[key] as any instanceof firebase.firestore.DocumentReference) {
        if (!documentClass.referenceClassMap[key]) {
          throw new Error(`${documentClass.name} does not have reference mapping class of ${key}.
Maybe you forget to set @Reference decorator to ${key} in ${documentClass.name} class definition.`)
        }

        obj[key] = new FastFireReference(documentClass.referenceClassMap[key], data[key]) as never
      } else {
        obj[key] = data[key] as never
      }
    }
    return obj
  }
}
