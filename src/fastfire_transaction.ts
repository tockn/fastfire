// import { FastFireDocument } from './fastfire_document';
// import { DocumentFields, IDocumentClass } from './types';
// import { fastFireFieldsToFirebaseFields } from './document_converter';
// import { FastFire } from './fastfire';
// import { validateDocumentFields } from './validator';
// import { FirestoreTransaction } from './firestore';
//
// export class FastFireTransaction {
//   private firestoreTransaction: FirestoreTransaction;
//
//   constructor(firestoreTransaction: FirestoreTransaction) {
//     this.firestoreTransaction = firestoreTransaction;
//   }
//
//   async create<T extends FastFireDocument<any>>(
//     documentClass: IDocumentClass<T>,
//     fields: DocumentFields<T>
//   ): Promise<void> {
//     const firebaseFields = fastFireFieldsToFirebaseFields(
//       documentClass,
//       fields
//     );
//     // @ts-ignore
//     this.firestoreTransaction = await this.firestoreTransaction.set(
//       FastFire.firestore.collection(documentClass.collectionRef).doc(),
//       firebaseFields
//     );
//   }
//
//   async findById<T extends FastFireDocument<any>>(
//     documentClass: IDocumentClass<T>,
//     id: string
//   ): Promise<T | null> {
//     const snapshot = await this.firestoreTransaction.get(
//       // @ts-ignore
//       FastFire.firestore.collection(documentClass.collectionRef).doc(id)
//     );
//     // @ts-ignore
//     return await FastFireDocument.fromSnapshot<T>(documentClass, snapshot);
//   }
//
//   async update<T extends FastFireDocument<any>>(
//     document: FastFireDocument<any>,
//     fields: DocumentFields<T>
//   ) {
//     validateDocumentFields(document.constructor as IDocumentClass<any>, fields);
//     // @ts-ignore
//     await this.firestoreTransaction.update(document.reference, fields);
//   }
//
//   async delete<T extends FastFireDocument<any>>(document: FastFireDocument<any>) {
//     // @ts-ignore
//     await this.firestoreTransaction.delete(document.reference);
//   }
// }
