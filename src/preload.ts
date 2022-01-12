import { FastFireDocument } from './fastfire_document';

export const preload = async <T extends FastFireDocument<any>>(
  document: T,
  referenceFields: (keyof T)[]
) => {
  const promises: Promise<void>[] = [];
  for (const field of referenceFields) {
    const promise = new Promise<void>(resolve => {
      const descriptor = Object.getOwnPropertyDescriptor(document, field);
      if (!descriptor) {
        throw new PreloadError(
          `${
            FastFireDocument.collectionRefMap[document.constructor.name]
          } does not have property "${field}"`
        );
      }
      if (
        !descriptor.writable ||
        !(descriptor.value instanceof FastFireDocument)
      ) {
        throw new PreloadError(
          `${
            FastFireDocument.collectionRefMap[document.constructor.name]
          }.${field} is not FastFireDocument`
        );
      }
      descriptor.value.reference
        .get()
        // @ts-ignore
        .then(async doc => {
          // @ts-ignore
          document[field] = await FastFireDocument.fromSnapshot(
            descriptor.value.constructor,
            doc
          );
          resolve();
        });
    });
    promises.push(promise);
  }
  await Promise.all(promises);
};

class PreloadError extends Error {}
