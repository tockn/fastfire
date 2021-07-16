import firebase from "firebase";
import { ActiveFire } from "./active_fire";
import { IConstructable } from "./types";

export class WhereChain<T> {
  documentClass: IConstructable<T>
  query: firebase.firestore.Query

  constructor(documentClass: IConstructable<T>, query: firebase.firestore.Query) {
    this.documentClass = documentClass
    this.query = query
  }

  get collectionRef(): firebase.firestore.CollectionReference {
    return ActiveFire.firestore.collection(this.documentClass.name)
  }

  async forEach(callback: (result: T) => void) {
    const snapshots = await this.query.get()
    snapshots.forEach((snapshot) => {
      const fire = this.fromSnapshot(snapshot)
      if (!fire) return
      callback(fire)
    })
  }

  async where(
    fieldPath: string | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: any
  ): Promise<WhereChain<T>> {
    const query = await this.collectionRef.where(fieldPath, opStr, value)
    return new WhereChain<T>(this.documentClass, query)
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
