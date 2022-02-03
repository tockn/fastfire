import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { FastFire } from './fastfire';
import { IDocumentClass } from './types';
import { preload } from './preload';
import { FastFireDocument } from './fastfire_document';
import { unique } from './utils';
import FieldPath = firebase.firestore.FieldPath;
import OrderByDirection = firebase.firestore.OrderByDirection;
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {
  FirebaseQuery,
  FirebaseQueryDocumentSnapshot,
  FirestoreCollectionReference,
} from './firestore';

export class QueryChain<T extends FastFireDocument<any>> {
  documentClass: IDocumentClass<T>;
  query?: FirebaseQuery;

  private preloadReferenceFields: (keyof T)[];

  constructor(
    documentClass: IDocumentClass<T>,
    query?: FirebaseQuery,
    preloadReferenceFields: (keyof T)[] = []
  ) {
    this.documentClass = documentClass;
    this.query = query;
    this.preloadReferenceFields = preloadReferenceFields;
  }

  get collectionRef(): FirestoreCollectionReference {
    return FastFire.firestore.collection(this.documentClass.name);
  }

  async get(): Promise<T[]> {
    return this.execQuery();
  }

  where(
    fieldPath: keyof T | FieldPath | '__name__',
    opStr: WhereFilterOp,
    value: any
  ): QueryChain<T> {
    if (this.query) {
      this.query = this.query.where(fieldPath as string, opStr, value);
    } else {
      this.query = this.collectionRef.where(fieldPath as string, opStr, value);
    }
    return this;
  }

  preload(referenceFields: (keyof T)[]): QueryChain<T> {
    this.preloadReferenceFields = unique(
      this.preloadReferenceFields.concat(referenceFields)
    );
    return this;
  }

  async findById(id: string): Promise<T | null> {
    const snapshot = await this.collectionRef.doc(id).get();
    if (!snapshot.exists) return null;

    if (this.query || this.preloadReferenceFields) {
      const docs = await this.execQuery();
      for (const doc of docs) {
        if (doc.id === id) return doc;
      }
      return null;
    }
    return await FastFireDocument.fromSnapshot<T>(this.documentClass, snapshot);
  }

  limit(limit: number): QueryChain<T> {
    if (this.query) {
      this.query = this.query.limit(limit);
    } else {
      this.query = this.collectionRef.limit(limit);
    }
    return this;
  }

  limitToLast(limit: number): QueryChain<T> {
    if (this.query) {
      this.query = this.query.limitToLast(limit);
    } else {
      this.query = this.collectionRef.limitToLast(limit);
    }
    return this;
  }

  orderBy(
    fieldPath: string | FieldPath,
    directionStr?: OrderByDirection
  ): QueryChain<T> {
    if (this.query) {
      this.query = this.query.orderBy(fieldPath, directionStr);
    } else {
      this.query = this.collectionRef.orderBy(fieldPath, directionStr);
    }
    return this;
  }

  onResultChange(cb: (docs: T[]) => void) {
    if (!this.query) {
      this.collectionRef.onSnapshot(async () => {
        const docs = await this.execQuery();
        cb(
          docs.map(doc => {
            doc.fastFireOptions.restrictUpdate = true;
            return doc;
          })
        );
      });
      return;
    }
    this.query.onSnapshot(async () => {
      const docs = await this.execQuery();
      cb(
        docs.map(doc => {
          doc.fastFireOptions.restrictUpdate = true;
          return doc;
        })
      );
    });
  }

  private async execQuery(): Promise<T[]> {
    let snapshots;
    if (this.query) {
      snapshots = await this.query.get();
    } else {
      snapshots = await FastFire.firestore
        .collection(this.documentClass.collectionRef)
        .get();
    }
    const docs: T[] = [];

    const promises: Promise<void>[] = [];
    snapshots.forEach((snapshot: FirebaseQueryDocumentSnapshot) => {
      const promise = new Promise<void>(async resolve => {
        const doc = await FastFireDocument.fromSnapshot<T>(
          this.documentClass,
          snapshot
        );
        if (!doc) return;
        preload<T>(doc, this.preloadReferenceFields).then(() => {
          docs.push(doc);
          resolve();
        });
      });
      promises.push(promise);
    });
    await Promise.all(promises);
    return docs;
  }
}
