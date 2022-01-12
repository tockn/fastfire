import { FastFireDocument } from './fastfire_document';

export const FastFireCollection = (collectionRef: string): ClassDecorator => {
  return target => {
    FastFireDocument.collectionRefMap[target.constructor.name] = collectionRef;
  };
};
