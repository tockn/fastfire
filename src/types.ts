import firebase from "firebase";

export interface IDocument {
  id: string
}

export interface IConstructable<T> {
  new(...args: any) : T
  name: string
}

export type DocumentFields<T> = { [key in keyof T]?: T[keyof T] | firebase.firestore.DocumentReference }
