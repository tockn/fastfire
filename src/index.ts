// import firebase from 'firebase';
// import { FastFire } from './fastfire';
// import { FastFireDocument } from './fastfire_document';
// import { FastFireField } from './fastfire_field';

export * from './fastfire';
export * from './fastfire_document';
export * from './query_chain';
export * from './fastfire_field';
export * from './fastfire_reference';
export * from './types';

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
// }
//
// class Article extends FastFireDocument<Article> {
//   @FastFireField({ required: true })
//   title!: string;
//   @FastFireField({ validate: Article.validateBody })
//   body!: string;
//
//   // Reference型はDecoratorを付ける
//   @FastFireReference(User)
//   author!: User;
//
//   static validateBody(body: string): ValidationResult {
//     if (body.length > 20) return 'too long';
//   }
// }

// const exec = async () => {
//   await FastFire.runTransaction(async transaction => {
//     const user = await transaction.findById(User, '4Uar6RBThDiI8DTPQalM');
//     if (user) {
//       await transaction.delete(user);
//     }
//   });
// };
//
// exec().catch(e => console.error(e));
