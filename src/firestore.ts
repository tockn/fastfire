import _f1 from 'firebase/compat/app';
import 'firebase/compat/firestore';
import _f2 from '@google-cloud/firestore';

export type Firestore = _f1.firestore.Firestore | _f2.Firestore;
export type FirestoreTransaction = _f1.firestore.Transaction | _f2.Transaction;
export type FirestoreDocumentData =
  | _f1.firestore.DocumentData
  | _f2.DocumentData;
export type FirestoreDocumentSnapshot<T = FirestoreDocumentData> =
  | _f1.firestore.DocumentSnapshot<T>
  | _f2.DocumentSnapshot<T>;
export type FirestoreDocumentReference =
  | _f1.firestore.DocumentReference
  | _f2.DocumentReference;
export type FirestoreCollectionReference =
  | _f1.firestore.CollectionReference
  | _f2.CollectionReference;
export type FirebaseQuery = _f1.firestore.Query | _f2.Query;
export type FirebaseQueryDocumentSnapshot =
  | _f1.firestore.QueryDocumentSnapshot
  | _f2.QueryDocumentSnapshot;
