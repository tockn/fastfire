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
import { preload } from './preload';
import {
  FirestoreCollectionReference,
  FirestoreDocumentReference,
  FirestoreDocumentSnapshot,
} from './firestore';

export class FastFireDocument<T> {
  static collectionRefMap: { [key: string]: string } = {};

  static referenceClassMaps: { [key: string]: ReferenceClassMap } = {};
  static referenceOptionsMaps: { [key: string]: ReferenceOptionsMap } = {};

  static fieldMaps: { [key: string]: FieldMap } = {};
  static fieldOptionsMaps: { [key: string]: FieldOptionsMap } = {};

  static get collectionRef(): string {
    return this.collectionRefMap[this.name];
  }

  static get collection(): FirestoreCollectionReference {
    return FastFire.firestore.collection(this.collectionRef);
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

  get collection(): FirestoreCollectionReference {
    return FastFire.firestore.collection(
      FastFireDocument.collectionRefMap[this.constructor.name]
    );
  }

  get reference(): FirestoreDocumentReference {
    return this.collection.doc(this.id);
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

  async loadAutoLoadReference(): Promise<void> {
    const preloadFields: string[] = [];
    Object.keys(this.documentClass.referenceOptionsMap).forEach(k => {
      const options = this.documentClass.referenceOptionsMap[k];
      if (!options.autoLoad) return;

      preloadFields.push(k);
    });
    await preload(this as any, preloadFields);
  }

  onChange(cb: (doc: T | null) => void) {
    this.reference.onSnapshot(async (snapshot: FirestoreDocumentSnapshot) => {
      const doc = await FastFireDocument.fromSnapshot(
        this.documentClass,
        snapshot
      );
      if (doc) doc.fastFireOptions.restrictUpdate = true;
      cb(doc);
    });
  }

  static async fromSnapshot<T extends FastFireDocument<any>>(
    documentClass: IDocumentClass<T>,
    snapshot: FirestoreDocumentSnapshot
  ): Promise<T | null> {
    if (!snapshot.exists) return null;
    const obj = new documentClass(snapshot.id);

    const data = snapshot.data() as never;
    for (let [key, value] of Object.entries(data)) {
      const objKey = key as keyof typeof obj;

      if (documentClass.referenceClassMap[key]) {
        obj[objKey] = new documentClass.referenceClassMap[key](
          (value as firebase.firestore.DocumentReference).id
        ) as never;
      } else if ((value as any)?.toDate instanceof Function) {
        obj[objKey] = (value as any).toDate() as never;
      } else {
        obj[objKey] = value as never;
      }
    }
    await obj.loadAutoLoadReference();
    return obj;
  }

  toJson(): { [key: string]: any } {
    const fields = Object.keys(this.fieldMap);
    const json = { id: this.id };
    fields.forEach(k => {
      const value = this[k as never];
      if ((value as any) instanceof Date) {
        json[k as never] = (value as Date).getTime() as never;
        return;
      }
      json[k as never] = this[k as never] || null;
    });
    Object.keys(this.documentClass.referenceClassMap).forEach(k => {
      json[k as never] = (this[k as never] as any).toJson() as never;
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
