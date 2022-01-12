import { FastFireDocument } from './fastfire_document';

export const FastFireCollection = (collectionRef: string): ClassDecorator => {
  return target => {
    FastFireDocument.collectionRefMap[target.name] = collectionRef;
  };
};
