import firebase from 'firebase';

export interface IDocumentClass<T> {
  new (...args: any): T;
  name: string;
  readonly referenceClassMap: ReferenceClassMap;
  readonly fieldMap: FieldMap;
  readonly fieldOptionsMap: FieldOptionsMap;
}

export type DocumentFields<T> = {
  [key in keyof T]?: T[keyof T] | firebase.firestore.DocumentReference;
};

export type ReferenceClassMap = { [key: string]: IDocumentClass<any> };
export type FieldMap = { [fieldName: string]: boolean };
export type FieldOptionsMap = { [fieldName: string]: IFastFireFieldOptions };

export interface IFastFireFieldOptions {
  required: boolean;
  validate: (value: any) => void | string;
}
