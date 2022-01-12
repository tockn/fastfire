import { FastFireDocument } from './fastfire_document';
import { DocumentFields, IDocumentClass } from './types';

export const validateDocumentFields = <T extends FastFireDocument<any>>(
  documentClass: IDocumentClass<T>,
  fields: DocumentFields<T>
): void => {
  for (const [key, value] of Object.entries(fields)) {
    let validationResult = null;
    if (documentClass.fieldMap[key]) {
      validationResult = documentClass.fieldOptionsMap[key].validate(value);
    } else if (documentClass.referenceClassMap[key]) {
      validationResult = documentClass.referenceOptionsMap[key].validate(value);
    } else {
      throw new UnknownFieldError(documentClass.collectionRef, key);
    }
    if (validationResult)
      throw new DocumentValidationError(
        documentClass.collectionRef,
        `${key}: ${validationResult}`
      );
  }
};

export const validateRequiredDocumentFields = <T extends FastFireDocument<any>>(
  documentClass: IDocumentClass<T>,
  fields: DocumentFields<T>
): void => {
  for (const [key, options] of Object.entries(documentClass.fieldOptionsMap)) {
    if (options.required && !fields[key as keyof typeof fields])
      throw new RequiredFieldError(documentClass.collectionRef, key);
  }
};

class DocumentValidationError extends Error {
  constructor(documentName: string, message: string) {
    super(`"${documentName}" ${message}`);
  }
}

class RequiredFieldError extends DocumentValidationError {
  constructor(documentName: string, fieldName: string) {
    super(documentName, `${fieldName} is required`);
  }
}

class UnknownFieldError extends DocumentValidationError {
  constructor(documentName: string, fieldName: string) {
    super(
      documentName,
      `You are trying to create or update unknown field "${fieldName}"`
    );
  }
}
