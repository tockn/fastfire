import { QueryChain } from './query_chain';
import { DocumentFields, IDocumentClass } from './types';
import { FastFireDocument } from './fastfire_document';
import { unique } from './utils';
import { fastFireFieldsToFirebaseFields } from './document_converter';
import { Firestore } from './firestore';
import firebase from 'firebase/compat/app';

export abstract class FastFire {
  static firestore: Firestore;

  static initialize(firestore: Firestore) {
    this.firestore = firestore;
  }

  // static async runTransaction<T>(
  //   updateFunction: (transaction: FastFireTransaction) => Promise<T>
  // ): Promise<T> {
  //   // @ts-ignore
  //   return await this.firestore.runTransaction<T>(async transaction => {
  //     return await updateFunction(new FastFireTransaction(transaction));
  //   });
  // }

  static async create<T extends FastFireDocument<any>>(
    documentClass: IDocumentClass<T>,
    fields: DocumentFields<T>
  ): Promise<T> {
    const firebaseFields = fastFireFieldsToFirebaseFields(
      documentClass,
      fields
    );
    const docRef = await this.firestore
      .collection(documentClass.name)
      .add(firebaseFields);
    const snapshot = await docRef.get();
    return (await FastFireDocument.fromSnapshot(documentClass, snapshot)) as T;
  }

  static async findById<T extends FastFireDocument<any>>(
    documentClass: IDocumentClass<T>,
    id: string
  ): Promise<T | null> {
    const snapshot = await this.firestore
      .collection(documentClass.name)
      .doc(id)
      .get();
    return await FastFireDocument.fromSnapshot<T>(documentClass, snapshot);
  }

  static where<T extends FastFireDocument<any>>(
    documentClass: IDocumentClass<T>,
    fieldPath: keyof T | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: any
  ): QueryChain<T> {
    const query = this.firestore
      .collection(documentClass.name)
      .where(fieldPath as string, opStr, value);
    return new QueryChain(documentClass, query);
  }

  static all<T extends FastFireDocument<any>>(
    documentClass: IDocumentClass<T>
  ): QueryChain<T> {
    return new QueryChain(documentClass);
  }

  static preload<T extends FastFireDocument<any>>(
    documentClass: IDocumentClass<T>,
    referenceFields: (keyof T)[]
  ): QueryChain<T> {
    return new QueryChain<T>(documentClass, undefined, unique(referenceFields));
  }
}
