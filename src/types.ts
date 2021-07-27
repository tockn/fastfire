import firebase from 'firebase';

export interface IDocumentClass<T> {
  new (...args: any): T;
  name: string;
  readonly referenceClassMap: ReferenceClassMap;
  readonly fieldMap: FieldMap;
}

export type DocumentFields<T> = {
  [key in keyof T]?: T[keyof T] | firebase.firestore.DocumentReference;
};

export type ReferenceClassMap = { [key: string]: IDocumentClass<any> };
export type FieldMap = { [fieldName: string]: boolean };
