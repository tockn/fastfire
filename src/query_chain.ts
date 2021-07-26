import firebase from 'firebase';
import { FastFire } from './fastfire';
import { IDocumentClass } from './types';
import { preload } from './preload';
import { FastFireDocument } from './fastfire_document';
import { unique } from './utils';

export class QueryChain<T extends FastFireDocument<T>> {
  documentClass: IDocumentClass<T>;
  query?: firebase.firestore.Query;

  private readonly preloadReferenceFields: (keyof T)[];

  constructor(
    documentClass: IDocumentClass<T>,
    query?: firebase.firestore.Query,
    preloadReferenceFields: (keyof T)[] = []
  ) {
    this.documentClass = documentClass;
    this.query = query;
    this.preloadReferenceFields = preloadReferenceFields;
  }

  get collectionRef(): firebase.firestore.CollectionReference {
    return FastFire.firestore.collection(this.documentClass.name);
  }

  async forEach(callback: (result: T) => void) {
    const docs = await this.execQuery();
    docs.forEach(doc => {
      callback(doc);
    });
  }

  where(
    fieldPath: keyof T | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: any
  ): QueryChain<T> {
    return new QueryChain<T>(
      this.documentClass,
      this.collectionRef.where(fieldPath as string, opStr, value),
      this.preloadReferenceFields
    );
  }

  preload(referenceFields: (keyof T)[]): QueryChain<T> {
    return new QueryChain<T>(
      this.documentClass,
      this.query,
      unique(this.preloadReferenceFields.concat(referenceFields))
    );
  }

  async findById(id: string): Promise<T | null> {
    const docById = await this.collectionRef.doc(id).get();
    if (!docById.exists) return null;

    if (this.query) {
      const docs = await this.execQuery();
      for (const doc of docs) {
        if (doc.id === id) return doc;
      }
      return null;
    }
    return FastFire.fromSnapshot<T>(this.documentClass, docById);
  }

  onChange(cb: (docs: T[]) => void) {
    if (!this.query) return;
    this.query.onSnapshot(async () => {
      const docs = await this.execQuery();
      cb(
        docs.map(doc => {
          doc.restrictUpdate = true;
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
        .collection(this.documentClass.name)
        .get();
    }
    const docs: T[] = [];

    const promises: Promise<void>[] = [];
    snapshots.forEach(snapshot => {
      const promise = new Promise<void>(resolve => {
        const doc = FastFire.fromSnapshot<T>(this.documentClass, snapshot);
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
