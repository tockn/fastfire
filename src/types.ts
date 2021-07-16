
export interface IDocument {
  id: string
}

export interface IConstructable<T> {
  new(...args: any) : T
  name: string
}

export type DocumentFields<T> = { [key in keyof T]?: any }
