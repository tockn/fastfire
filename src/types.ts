
export interface IDocument {
  id: string
}

export interface IConstructable<T> {
  new(...args: any) : T
  name: string
}
