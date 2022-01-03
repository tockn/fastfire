import firebase from 'firebase/compat/app';
import 'firebase/firestore';

export interface IDocumentClass<T> {
  new (...args: any): T;
  name: string;
  readonly referenceClassMap: ReferenceClassMap;
  readonly referenceOptionsMap: ReferenceOptionsMap;
  readonly fieldMap: FieldMap;
  readonly fieldOptionsMap: FieldOptionsMap;
}

export type DocumentFields<T> = {
  [key in keyof T]?: T[keyof T] | firebase.firestore.DocumentReference;
};

export type ReferenceClassMap = { [key: string]: IDocumentClass<any> };
export type FieldMap = { [fieldName: string]: boolean };
export type FieldOptionsMap = { [fieldName: string]: IFastFireFieldOptions };
export type ReferenceOptionsMap = {
  [fieldName: string]: IFastFireReferenceOptions;
};

export interface IFastFireFieldOptions {
  required: boolean;
  validate: (value: any) => ValidationResult;
}

export interface IFastFireReferenceOptions {
  required: boolean;
  validate: (value: any) => ValidationResult;
}

export type ValidationResult = void | string;

export interface FastFireDocumentOptions {
  // to avoid infinite loop in onChange
  restrictUpdate: boolean;
}
