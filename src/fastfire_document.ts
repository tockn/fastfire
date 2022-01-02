import firebase from 'firebase';
import { FastFire } from './fastfire';
import {
  FieldMap,
  DocumentFields,
  IDocumentClass,
  ReferenceClassMap,
  FieldOptionsMap,
  FastFireDocumentOptions,
} from './types';
import { validateDocumentFields } from './validator';
import Timestamp = firebase.firestore.Timestamp;

export class FastFireDocument<T> {
  static referenceClassMaps: { [key: string]: ReferenceClassMap } = {};
  static fieldMaps: { [key: string]: FieldMap } = {};
  static fieldOptionsMaps: { [key: string]: FieldOptionsMap } = {};

  static get collection(): firebase.firestore.CollectionReference {
    return FastFire.firestore.collection(this.name);
  }

  // id is a firestore document id
  public id: string;

  public fastFireOptions: FastFireDocumentOptions = {
    // to avoid infinite loop in onChange
    restrictUpdate: false,
  };

  constructor(id: string) {
    this.id = id;
  }

  static get referenceClassMap(): ReferenceClassMap {
    if (!FastFireDocument.referenceClassMaps[this.name])
      FastFireDocument.referenceClassMaps[this.name] = {};
    return FastFireDocument.referenceClassMaps[this.name];
  }

  static get fieldMap(): FieldMap {
    if (!FastFireDocument.fieldMaps[this.name])
      FastFireDocument.fieldMaps[this.name] = {};
    return FastFireDocument.fieldMaps[this.name];
  }

  static get fieldOptionsMap(): FieldOptionsMap {
    if (!FastFireDocument.fieldOptionsMaps[this.name])
      FastFireDocument.fieldOptionsMaps[this.name] = {};
    return FastFireDocument.fieldOptionsMaps[this.name];
  }

  get reference(): firebase.firestore.DocumentReference {
    return FastFire.firestore.collection(this.constructor.name).doc(this.id);
  }

  async update(fields: DocumentFields<T>) {
    if (this.fastFireOptions.restrictUpdate) {
      throw new AvoidInfiniteLoopError();
    }
    validateDocumentFields(this.constructor as IDocumentClass<any>, fields);
    await this.reference.update(fields);
  }

  async delete() {
    await this.reference.delete();
  }

  onChange(cb: (doc: T | null) => void) {
    this.reference.onSnapshot(snapshot => {
      const doc = FastFireDocument.fromSnapshot(
        this.constructor as IDocumentClass<any>,
        snapshot
      );
      if (doc) doc.fastFireOptions.restrictUpdate = true;
      cb(doc);
    });
  }

  static fromSnapshot<T extends FastFireDocument<T>>(
    documentClass: IDocumentClass<T>,
    snapshot: firebase.firestore.DocumentSnapshot
  ): T | null {
    if (!snapshot.exists) return null;
    const obj = new documentClass(snapshot.id);

    const data = snapshot.data() as never;
    for (let [key, value] of Object.entries(data)) {
      const objKey = key as keyof typeof obj;

      if (documentClass.referenceClassMap[key]) {
        obj[objKey] = new documentClass.referenceClassMap[key](
          (value as firebase.firestore.DocumentReference).id
        ) as never;
      } else if (value instanceof Timestamp) {
        obj[objKey] = value.toDate() as never;
      } else {
        obj[objKey] = value as never;
      }
    }
    return obj;
  }
}

class AvoidInfiniteLoopError extends Error {
  constructor() {
    super(
      'An infinite loop of update processing may occurred, which could cause a heavy load on the Firestore, so an exception was thrown and the processing was interrupted. If this behavior is normal, set restrictUpdate to false for the document.'
    );
  }
}
