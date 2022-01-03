import firebase from 'firebase/compat/app';
import { FastFire } from './fastfire';
import {
  FieldMap,
  DocumentFields,
  IDocumentClass,
  ReferenceClassMap,
  FieldOptionsMap,
  FastFireDocumentOptions,
  ReferenceOptionsMap,
} from './types';
import { fastFireFieldsToFirebaseFields } from './document_converter';

export class FastFireDocument<T> {
  static referenceClassMaps: { [key: string]: ReferenceClassMap } = {};
  static referenceOptionsMaps: { [key: string]: ReferenceOptionsMap } = {};

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

  static get referenceOptionsMap(): ReferenceOptionsMap {
    if (!FastFireDocument.referenceOptionsMaps[this.name])
      FastFireDocument.referenceOptionsMaps[this.name] = {};
    return FastFireDocument.referenceOptionsMaps[this.name];
  }

  get fieldMap(): FieldMap {
    if (!FastFireDocument.fieldMaps[this.constructor.name])
      FastFireDocument.fieldMaps[this.constructor.name] = {};
    return FastFireDocument.fieldMaps[this.constructor.name];
  }

  get reference(): firebase.firestore.DocumentReference {
    return FastFire.firestore.collection(this.constructor.name).doc(this.id);
  }

  get documentClass(): IDocumentClass<any> {
    return this.constructor as IDocumentClass<any>;
  }

  async update(fields: DocumentFields<T>) {
    if (this.fastFireOptions.restrictUpdate) {
      throw new AvoidInfiniteLoopError();
    }
    const firebaseFields = fastFireFieldsToFirebaseFields(
      this.documentClass,
      fields
    );
    await this.reference.update(firebaseFields);
  }

  async delete() {
    await this.reference.delete();
  }

  onChange(cb: (doc: T | null) => void) {
    this.reference.onSnapshot(snapshot => {
      const doc = FastFireDocument.fromSnapshot(this.documentClass, snapshot);
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
      } else if ((value as any).toDate instanceof Function) {
        obj[objKey] = (value as any).toDate() as never;
      } else {
        obj[objKey] = value as never;
      }
    }
    return obj;
  }

  toJson(): { [key: string]: any } {
    const keys = Object.keys(this.fieldMap);
    const json = { id: this.id };
    keys.forEach(k => {
      const value = this[k as never];
      if ((value as any) instanceof Date) {
        json[k as never] = (value as Date).getTime() as never;
        return;
      }
      json[k as never] = this[k as never] || null;
    });
    return json;
  }
}

class AvoidInfiniteLoopError extends Error {
  constructor() {
    super(
      'An infinite loop of update processing may occurred, which could cause a heavy load on the Firestore, so an exception was thrown and the processing was interrupted. If this behavior is normal, set restrictUpdate to false for the document.'
    );
  }
}
