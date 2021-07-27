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
//
// const exec = async () => {
//   const doc = await FastFire.create(Article, {
//     body: 'body dayo',
//   });
//   console.log(await FastFire.findById(Article, doc.id));
//   // const query = await FastFire.preload(Article, ['author']).where(
//   //   'title',
//   //   '==',
//   //   'title'
//   // );
//   // query.onResultChange(docs => {
//   //   console.log('updated!', docs);
//   // });
//   // console.log(await query.get());
//
//   // const doc = await FastFire.findById(Article, 'LmfQE9rAFKx3xNJbOATZ');
//   // // const doc = await FastFire.findById(Article, 'N0Oc0PzH4b95t6LlSEV5');
//   // doc?.onChange(async doc => {
//   //   console.log(doc);
//   // });
// };
//
// exec().catch(e => console.error(e));
