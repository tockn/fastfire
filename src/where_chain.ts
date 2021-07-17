import firebase from "firebase";
import { FastFire } from "./fastfire";
import { IDocumentClass } from "./types";

export class QueryChain<T> {
  documentClass: IDocumentClass<T>
  query: firebase.firestore.Query

  constructor(documentClass: IDocumentClass<T>, query: firebase.firestore.Query) {
    this.documentClass = documentClass
    this.query = query
  }

  get collectionRef(): firebase.firestore.CollectionReference {
    return FastFire.firestore.collection(this.documentClass.name)
  }

  async forEach(callback: (result: T) => void) {
    const snapshots = await this.query.get()
    snapshots.forEach((snapshot) => {
      const fire = this.fromSnapshot(snapshot)
      if (!fire) return
      callback(fire)
    })
  }

  where(
    fieldPath: keyof T | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: any
  ): QueryChain<T> {
    return new QueryChain<T>(this.documentClass, this.collectionRef.where(fieldPath as string, opStr, value))
  }

  private fromSnapshot(snapshot: firebase.firestore.DocumentSnapshot): T | null {
    const obj = new this.documentClass(snapshot.id) as unknown as T
    if (!snapshot.exists) return null

    const data = snapshot.data() as never
    const keys = Object.keys(data)
    for (const key of keys) {
      obj[key as never] = data[key] as never
    }
    return obj
  }
}
