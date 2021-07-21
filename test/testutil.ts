import firebase from 'firebase';

export type MockFirestoreData = {
  [collectionName: string]: { [id: string]: { [key: string]: any } };
};

export const SetUpMockFirestore = (data: MockFirestoreData) => {
  const collection = jest.fn(name => {
    return {
      doc: jest.fn(id => {
        const d = data[name][id];
        return {
          get: () => {
            return {
              id: !!d ? id : null,
              data: () => d,
              exists: !!d,
            };
          },
        };
      }),
    };
  });
  jest
    .spyOn(firebase, 'firestore')
    .mockReturnValue(({ collection } as unknown) as any);
};
