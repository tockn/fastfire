import { FastFireDocument } from './fastfire_document';
import { FastFire } from './fastfire';

export const preload = async <T extends FastFireDocument<T>>(
  document: T,
  referenceFields: (keyof T)[]
) => {
  const promises: Promise<void>[] = [];
  for (const field of referenceFields) {
    const promise = new Promise<void>(resolve => {
      const descriptor = Object.getOwnPropertyDescriptor(document, field);
      if (!descriptor) {
        throw new PreloadError(
          `${document.constructor.name} does not have property "${field}"`
        );
      }
      if (
        !descriptor.writable ||
        !(descriptor.value instanceof FastFireDocument)
      ) {
        throw new PreloadError(
          `${document.constructor.name}.${field} is not FastFireDocument`
        );
      }
      descriptor.value.reference.get().then(doc => {
        // @ts-ignore
        document[field] = FastFire.fromSnapshot(
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