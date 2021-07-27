import { FastFireDocument } from './fastfire_document';
import { IFastFireFieldOptions } from './types';

export const FastFireField = (options?: Partial<IFastFireFieldOptions>) => {
  return (target: any, propertyKey: string) => {
    const documentName = target.constructor.name;
    if (!FastFireDocument.fieldMaps[documentName])
      FastFireDocument.fieldMaps[documentName] = {};
    FastFireDocument.fieldMaps[documentName][propertyKey] = true;

    if (!FastFireDocument.fieldOptionsMaps[documentName])
      FastFireDocument.fieldOptionsMaps[documentName] = {};
    FastFireDocument.fieldOptionsMaps[documentName][
      propertyKey
    ] = Object.assign({}, defaultFieldOptions, options);
  };
};

const defaultFieldOptions: IFastFireFieldOptions = {
  required: false,
  validate: () => {},
};
