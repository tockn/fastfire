import firebase from "firebase";

export class ActiveFire {

  protected static firestore: firebase.firestore.Firestore

  static initialize(firestore: firebase.firestore.Firestore) {
    this.firestore = firestore
  }

  static get collection(): firebase.firestore.CollectionReference {
    return this.firestore.collection(this.name)
  }

  static async findById<T>(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get()
    return this.fromSnapshot(doc)
  }

  static async where<T>(): Promise<T[]> {
    const snapshots = await this.collection.where("name", "==", "tockn").get()
    const docs: T[] = []
    snapshots.forEach((snapshot) => {
      docs.push(this.fromSnapshot(snapshot) as T)
    })
    return docs
  }

  private static fromSnapshot<T>(snapshot: firebase.firestore.DocumentSnapshot): T | null {
    const obj = new this(snapshot.id) as unknown as T
    if (!snapshot.exists) return null

    const data = snapshot.data() as never
    const keys = Object.keys(data)
    for (const key of keys) {
      obj[key as never] = data[key] as never
    }
    return obj
  }

  // id is a firestore document id
  public id: string

  constructor(id: string) {
    this.id = id
  }

  get document(): firebase.firestore.DocumentReference {
    return ActiveFire.firestore.collection(this.constructor.name).doc(this.id)
  }

  async update(data: firebase.firestore.DocumentData) {
    await this.document.update(data)
  }
}


export class ArrayActiveFire {
  documents: ActiveFire[]

  constructor(documents: ActiveFire[]) {
    this.documents = documents
  }
}
