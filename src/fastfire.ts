import { QueryChain } from './query_chain';
import { DocumentFields, IDocumentClass } from './types';
import { FastFireDocument } from './fastfire_document';
import { unique } from './utils';
import { fastFireFieldsToFirebaseFields } from './document_converter';
import { Firestore, FirestoreDocumentReference } from './firestore';
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
    fields: DocumentFields<T>,
    id?: string
  ): Promise<T> {
    const firebaseFields = fastFireFieldsToFirebaseFields(
      documentClass,
      fields
    );
    let docRef: FirestoreDocumentReference;
    if (id) {
      await this.firestore
        .collection(documentClass.collectionRef)
        .doc(id)
        .set(firebaseFields);
      docRef = this.firestore.collection(documentClass.collectionRef).doc(id);
    } else {
      docRef = await this.firestore
        .collection(documentClass.collectionRef)
        .add(firebaseFields);
    }
    const snapshot = await docRef.get();
    return (await FastFireDocument.fromSnapshot(documentClass, snapshot)) as T;
  }

  static async findById<T extends FastFireDocument<any>>(
    documentClass: IDocumentClass<T>,
    id: string
  ): Promise<T | null> {
    const snapshot = await this.firestore
      .collection(documentClass.collectionRef)
      .doc(id)
      .get();
    return await FastFireDocument.fromSnapshot<T>(documentClass, snapshot);
  }

  static where<T extends FastFireDocument<any>>(
    documentClass: IDocumentClass<T>,
    fieldPath: keyof T | firebase.firestore.FieldPath | '__name__',
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
