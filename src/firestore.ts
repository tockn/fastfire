import _f1 from 'firebase/compat/app';
import 'firebase/firestore';
import _f2 from '@google-cloud/firestore';

export type Firestore = _f1.firestore.Firestore | _f2.Firestore;
export type FirestoreTransaction = _f1.firestore.Transaction | _f2.Transaction;
export type FirestoreDocumentSnapshot =
  | _f1.firestore.DocumentSnapshot
  | _f2.DocumentSnapshot;
export type FirestoreDocumentReference =
  | _f1.firestore.DocumentReference
  | _f2.DocumentReference;
export type FirestoreCollectionReference =
  | _f1.firestore.CollectionReference
  | _f2.CollectionReference;
export type FirebaseQuery = _f1.firestore.Query | _f2.Query;
