import { FastFireDocument } from "./fastfire_document";
import { IDocumentClass } from "./types";

export const FastFireReference = <T>(documentClass: IDocumentClass<T>) => {
  return (target: any, propertyKey: string) => {
    const documentName = target.constructor.name
    if (!FastFireDocument.referenceClassMaps[documentName]) FastFireDocument.referenceClassMaps[documentName] = {}
    FastFireDocument.referenceClassMaps[documentName][propertyKey] = documentClass
  }
}
