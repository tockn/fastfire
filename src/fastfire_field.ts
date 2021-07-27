import { FastFireDocument } from './fastfire_document';

export const FastFireField = () => {
  return (target: any, propertyKey: string) => {
    const documentName = target.constructor.name;
    if (!FastFireDocument.fieldMaps[documentName])
      FastFireDocument.fieldMaps[documentName] = {};
    FastFireDocument.fieldMaps[documentName][propertyKey] = true;
  };
};
