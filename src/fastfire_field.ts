import { FastFireDocument } from './fastfire_document';
import { IFastFireFieldOptions } from './types';

export const FastFireField = (
  options?: Partial<IFastFireFieldOptions>
): PropertyDecorator => {
  return (target, propertyKey) => {
    const documentName = target.constructor.name;
    if (!FastFireDocument.fieldMaps[documentName])
      FastFireDocument.fieldMaps[documentName] = {};
    FastFireDocument.fieldMaps[documentName][propertyKey as never] = true;

    if (!FastFireDocument.fieldOptionsMaps[documentName])
      FastFireDocument.fieldOptionsMaps[documentName] = {};
    FastFireDocument.fieldOptionsMaps[documentName][
      propertyKey as never
    ] = Object.assign({}, defaultFieldOptions, options);
  };
};

const defaultFieldOptions: IFastFireFieldOptions = {
  required: false,
  validate: () => {},
};
