import { FastFire } from './fastfire';

import firebase from 'firebase';
import { FastFireDocument } from './fastfire_document';
import { FastFireReference } from './fastfire_reference';

export * from './fastfire';
export * from './fastfire_document';
export * from './query_chain';

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

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));

const exec = async () => {
  // const docs = FastFire.preload(Article, ['author'])
  //   .where('title', '==', 'title')
  //   .preload(['author']);
  //
  // await docs.forEach(doc => {
  //   doc.onChange(async doc => {
  //     console.log('update:', doc);
  //   });
  // });

  const doc = await FastFire.findById(Article, 'LmfQE9rAFKx3xNJbOATZ');
  // const doc = await FastFire.findById(Article, 'N0Oc0PzH4b95t6LlSEV5');
  let num = 0;
  doc?.onChange(async doc => {
    await sleep(1000);
    console.log('update');
    doc?.update({ body: `${num}` });
  });
};

exec().catch(e => console.error(e));
