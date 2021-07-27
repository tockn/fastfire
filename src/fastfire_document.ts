import firebase from 'firebase';
import { FastFire } from './fastfire';
import {
  FieldMap,
  DocumentFields,
  IDocumentClass,
  ReferenceClassMap,
} from './types';

export class FastFireDocument<T> {
  static referenceClassMaps: { [key: string]: ReferenceClassMap } = {};
  static fieldMaps: { [key: string]: FieldMap } = {};

  static get collection(): firebase.firestore.CollectionReference {
    return FastFire.firestore.collection(this.name);
  }

  // id is a firestore document id
  public id: string;

  public fastFireOptions = {
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

  get reference(): firebase.firestore.DocumentReference {
    return FastFire.firestore.collection(this.constructor.name).doc(this.id);
  }

  async update(fields: DocumentFields<T>) {
    if (this.fastFireOptions.restrictUpdate) {
      throw new AvoidInfiniteLoopError();
    }
    await this.reference.update(fields);
  }

  async delete() {
    await this.reference.delete();
  }

  onChange(cb: (doc: FastFireDocument<T> | null) => void) {
    this.reference.onSnapshot(snapshot => {
      const doc = FastFire.fromSnapshot<FastFireDocument<T>>(
        this.constructor as IDocumentClass<any>,
        snapshot
      );
      if (doc) doc.fastFireOptions.restrictUpdate = true;
      cb(doc);
    });
  }
}

class AvoidInfiniteLoopError extends Error {
  constructor() {
    super(
      'An infinite loop of update processing may occurred, which could cause a heavy load on the Firestore, so an exception was thrown and the processing was interrupted. If this behavior is normal, set restrictUpdate to false for the document.'
    );
  }
}
