import firebase from "firebase";
import { WhereChain } from "./where_chain";
import { DocumentFields, IConstructable, IDocument } from "./types";

export abstract class FastFire {

  static firestore: firebase.firestore.Firestore

  static initialize(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore
  }

  static async create<T extends IDocument>(
    documentClass: IConstructable<T>,
    fields: DocumentFields<T>
  ): Promise<T> {
    const docRef = await this.firestore.collection(documentClass.name).add(fields)
    const doc = await docRef.get()
    return this.fromSnapshot(documentClass, doc) as T
  }

  static async findById<T extends IDocument>(
    documentClass: IConstructable<T>,
    id: string
  ): Promise<T | null> {
    const doc = await this.firestore.collection(documentClass.name).doc(id).get()
    return this.fromSnapshot(documentClass, doc)
  }

  static where<T extends IDocument>(
    documentClass: IConstructable<T>,
    fieldPath: string | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: any
  ): WhereChain<T> {
    const query = this.firestore.collection(documentClass.name).where(fieldPath, opStr, value)
    return new WhereChain(documentClass, query)
  }

  static fromSnapshot<T extends IDocument>(
    documentClass: IConstructable<T>,
    snapshot: firebase.firestore.DocumentSnapshot
  ): T | null {
    const obj = new documentClass(snapshot.id) as unknown as T
    if (!snapshot.exists) return null

    const data = snapshot.data() as never
    const keys = Object.keys(data)
    for (const key of keys) {
      obj[key as never] = data[key] as never
    }
    return obj
  }
}
