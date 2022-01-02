import firebase from 'firebase';
import { FastFire, FastFireDocument } from '../src';
// @ts-ignore
import { SetUpMockFirestore } from './testutil';

class User extends FastFireDocument<User> {
  name!: string;
}

describe('FastFire', () => {
  describe('findById', () => {
    beforeEach(() => {
      SetUpMockFirestore({
        User: { '1': { name: 'tockn' } },
      });
      FastFire.initialize(firebase.firestore());
    });
    it('found', async () => {
      const result = await FastFire.findById(User, '1');
      expect(result?.id).toEqual('1');
      expect(result?.name).toEqual('tockn');
    });
    it('not found', async () => {
      const result = await FastFire.findById(User, '2');
      expect(result).toBe(null);
    });
  });
  describe('create', () => {
    beforeEach(() => {
      FastFire.initialize(firebase.firestore());
    });
    it('created', async () => {
      await FastFire.create(User, { name: 'tockn' });
    });
    it('not found', async () => {
      const result = await FastFire.findById(User, '2');
      expect(result).toBe(null);
    });
  });
});
