// import firebase from 'firebase';
// import { FastFire } from './fastfire';
// import { FastFireDocument } from './fastfire_document';
// import { FastFireField } from './fastfire_field';
//
// export * from './fastfire';
// export * from './fastfire_document';
// export * from './query_chain';
// export * from './fastfire_field';
// export * from './fastfire_reference';
// export * from './types';
//
// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
// };
// firebase.initializeApp(firebaseConfig);
//
// FastFire.initialize(firebase.firestore());
//
// class User extends FastFireDocument<User> {
//   @FastFireField({ required: true })
//   name!: string;
//   @FastFireField()
//   bio!: string;
//   @FastFireField()
//   registeredAt!: Date;
// }
// //
// // class Article extends FastFireDocument<Article> {
// //   @FastFireField({ required: true })
// //   title!: string;
// //   @FastFireField({ validate: Article.validateBody })
// //   body!: string;
// //
// //   // Reference型はDecoratorを付ける
// //   @FastFireReference(User)
// //   author!: User;
// //
// //   static validateBody(body: string): ValidationResult {
// //     if (body.length > 20) return 'too long';
// //   }
// // }
//
// const exec = async () => {
//   // await FastFire.create(User, {
//   //   name: 'tockn',
//   //   registeredAt: new Date(),
//   // });
//   console.log(await FastFire.findById(User, '0EP0uC4etPWt6pbKJIsD'));
// };
//
// exec().catch(e => console.error(e));

//
// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
// };
//
// firebase.initializeApp(firebaseConfig);
//
// FastFire.initialize(firebase.firestore());
//
// @FastFireCollection('User')
// export class User extends FastFireDocument<User> {
//   @FastFireField()
//   name!: string;
//
//   @FastFireField()
//   bio!: string;
// }
//
// @FastFireCollection('Desk')
// export class Desk extends FastFireDocument<Desk> {
//   @FastFireField()
//   totalPrice!: number;
//
//   @FastFireField()
//   imageUrl!: string;
//
//   @FastFireField()
//   description!: string;
//
//   @FastFireField()
//   tags!: string[];
//
//   @FastFireReference(User)
//   author!: User;
// }
//
// const exec = async () => {
//   // const user = await FastFire.findById(User, 'XtckFWASbiYuXEaGQxef');
//   // if (!user) return;
//
//   const desk = await FastFire.findById(Desk, '2BFN5x1nAVlG0Jn5dlla');
//   console.log(desk?.toJson());
//
//   console.log(await FastFire.create(User, { name: 'hogeee' }, 'hogehoge'));
//
//   // const desks = await FastFire.preload(Desk, ['author'])
//   //   .where('totalPrice', '==', 800000)
//   //   .get();
//   // desks.forEach(d => {
//   //   console.log(d.author);
//   // });
//   // await desk?.update({ author: user });
// };
//
// exec().catch(e => console.error(e));

import { FastFire } from './fastfire';
import { FastFireDocument } from './fastfire_document';
import 'firebase/compat/firestore';
import { FastFireField } from './fastfire_field';
import { FastFireReference } from './fastfire_reference';
import { FastFireCollection } from './fastfire_collection';
import { FastFireDocumentOptions } from './types';

export {
  FastFire,
  FastFireDocument,
  FastFireDocumentOptions,
  FastFireField,
  FastFireReference,
  FastFireCollection,
};
