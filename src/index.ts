import { FastFire } from './fastfire';

import firebase from 'firebase';
import { FastFireDocument } from './fastfire_document';
import { FastFireReference } from './fastfire_reference';

export * from './fastfire';
export * from './fastfire_document';
export * from './where_chain';

export * from './types';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
firebase.initializeApp(firebaseConfig);

FastFire.initialize(firebase.firestore());

class User extends FastFireDocument<User> {
  name!: string;
  bio!: string;
}

class Article extends FastFireDocument<Article> {
  title!: string;
  body!: string;

  // Reference型はDecoratorを付ける
  @FastFireReference(User)
  author!: User;
}

const exec = async () => {
  const docs = FastFire.preload(Article, ['author']).where(
    'title',
    '==',
    'title'
  );

  await docs.forEach(doc => {
    console.log(doc.author.name); // taro
  });
};

exec().catch(e => console.error(e));
