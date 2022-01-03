import { FastFireDocument } from './fastfire_document';
import { IDocumentClass, IFastFireReferenceOptions } from './types';

export const FastFireReference = <T>(
  documentClass: IDocumentClass<T>,
  options?: Partial<IFastFireReferenceOptions>
) => {
  return (target: any, propertyKey: string) => {
    const documentName = target.constructor.name;
    if (!FastFireDocument.referenceClassMaps[documentName])
      FastFireDocument.referenceClassMaps[documentName] = {};
    FastFireDocument.referenceClassMaps[documentName][
      propertyKey
    ] = documentClass;

    if (!FastFireDocument.referenceOptionsMaps[documentName])
      FastFireDocument.referenceOptionsMaps[documentName] = {};
    FastFireDocument.referenceOptionsMaps[documentName][
      propertyKey
    ] = Object.assign({}, defaultReferenceOptions, options);
  };
};

const defaultReferenceOptions: IFastFireReferenceOptions = {
  required: true,
  validate: () => {},
};
