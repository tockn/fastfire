import { FastFireDocument } from './fastfire_document';
import { DocumentFields, IDocumentClass } from './types';
import {
  validateDocumentFields,
  validateRequiredDocumentFields,
} from './validator';

export const fastFireFieldsToFirebaseFields = <T extends FastFireDocument<any>>(
  documentClass: IDocumentClass<T>,
  fields: DocumentFields<T>
): DocumentFields<T> => {
  validateDocumentFields(documentClass, fields);
  validateRequiredDocumentFields(documentClass, fields);

  const data: DocumentFields<T> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (
      documentClass.referenceClassMap[key] &&
      value instanceof FastFireDocument
    ) {
      data[key as keyof typeof data] = value.reference;
      continue;
    }
    data[key as keyof typeof data] = value;
  }
  return data;
};
