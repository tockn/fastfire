import { FastFireReference } from "./fastfire_reference";
import { IDocument } from "./types";

export const preload = async <T>(document: IDocument, referenceFields: (keyof T)[]) => {
  const promises: Promise<void>[] = []
  for (const field of referenceFields) {
    const promise = new Promise<void>((resolve) => {
      const descriptor = Object.getOwnPropertyDescriptor(document, field)
      if (!descriptor) {
        throw new PreloadError(`${document.constructor.name} does not have property "${field}"`)
      }
      if (!descriptor.writable || !(descriptor.value instanceof FastFireReference)) {
        throw new PreloadError(`${document.constructor.name}.${field} is not FastFireReference`)
      }
      descriptor.value.load().then(() => resolve())
    })
    promises.push(promise)
  }
  await Promise.all(promises)
}

class PreloadError extends Error {}
