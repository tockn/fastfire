import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { FastFireDocument } from './fastfire_document';
import { DocumentFields, IDocumentClass } from './types';
import { fastFireFieldsToFirebaseFields } from './document_converter';
import { FastFire } from './fastfire';
import { validateDocumentFields } from './validator';

export class FastFireTransaction {
  private firestoreTransaction: firebase.firestore.Transaction;

  constructor(firestoreTransaction: firebase.firestore.Transaction) {
    this.firestoreTransaction = firestoreTransaction;
  }

  async create<T extends FastFireDocument<T>>(
    documentClass: IDocumentClass<T>,
    fields: DocumentFields<T>
  ): Promise<void> {
    const firebaseFields = fastFireFieldsToFirebaseFields(
      documentClass,
      fields
    );
    this.firestoreTransaction = await this.firestoreTransaction.set(
      FastFire.firestore.collection(documentClass.name).doc(),
      firebaseFields
    );
  }

  async findById<T extends FastFireDocument<T>>(
    documentClass: IDocumentClass<T>,
    id: string
  ): Promise<T | null> {
    const snapshot = await this.firestoreTransaction.get(
      FastFire.firestore.collection(documentClass.name).doc(id)
    );
    return FastFireDocument.fromSnapshot<T>(documentClass, snapshot);
  }

  async update<T extends FastFireDocument<T>>(
    document: FastFireDocument<T>,
    fields: DocumentFields<T>
  ) {
    validateDocumentFields(document.constructor as IDocumentClass<any>, fields);
    await this.firestoreTransaction.update(document.reference, fields);
  }

  async delete<T extends FastFireDocument<T>>(document: FastFireDocument<T>) {
    await this.firestoreTransaction.delete(document.reference);
  }
}
