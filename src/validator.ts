import { FastFireDocument } from './fastfire_document';
import { DocumentFields, IDocumentClass } from './types';

export const validateDocumentFields = <T extends FastFireDocument<T>>(
  documentClass: IDocumentClass<T>,
  fields: DocumentFields<T>
): void => {
  for (const [key, value] of Object.entries(fields)) {
    if (!documentClass.fieldMap[key])
      throw new UnknownFieldError(documentClass.name, key);
    const validationResult = documentClass.fieldOptionsMap[key].validate(value);
    if (validationResult)
      throw new DocumentValidationError(
        documentClass.name,
        `${key}: ${validationResult}`
      );
  }
};

export const validateRequiredDocumentFields = <T extends FastFireDocument<T>>(
  documentClass: IDocumentClass<T>,
  fields: DocumentFields<T>
): void => {
  for (const [key, options] of Object.entries(documentClass.fieldOptionsMap)) {
    if (options.required && !fields[key as keyof typeof fields])
      throw new RequiredFieldError(documentClass.name, key);
  }
};

class DocumentValidationError extends Error {
  constructor(documentName: string, message: string) {
    super(`${documentName} Validation Error! ${message}`);
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
