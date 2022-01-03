import { FastFireDocument } from './fastfire_document';
import { IDocumentClass, IFastFireReferenceOptions } from './types';

export const FastFireReference = <T>(
  documentClass: IDocumentClass<T>,
  options?: Partial<IFastFireReferenceOptions>
): PropertyDecorator => {
  return (target, propertyKey) => {
    const documentName = target.constructor.name;
    if (!FastFireDocument.referenceClassMaps[documentName])
      FastFireDocument.referenceClassMaps[documentName] = {};
    FastFireDocument.referenceClassMaps[documentName][
      propertyKey as never
    ] = documentClass;

    if (!FastFireDocument.referenceOptionsMaps[documentName])
      FastFireDocument.referenceOptionsMaps[documentName] = {};
    FastFireDocument.referenceOptionsMaps[documentName][
      propertyKey as never
    ] = Object.assign({}, defaultReferenceOptions, options);
  };
};

const defaultReferenceOptions: IFastFireReferenceOptions = {
  required: true,
  autoLoad: true,
  validate: () => {},
};
