import { FastFire } from "./fastfire";

export * from './fastfire'
export * from './fastfire_document'
export * from './where_chain'

export * from './types'

import firebase from "firebase";
import { FastFireDocument } from "./fastfire_document";
import { FastFireReference, Reference } from "./fastfire_reference";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};
firebase.initializeApp(firebaseConfig);

FastFire.initialize(firebase.firestore())



// === model定義。FastFireDocumentを継承する ===
class User extends FastFireDocument<User> {
  name!: string
  bio!: string
}

class Article extends FastFireDocument<Article> {
  title!: string
  body!: string

  // Reference型はDecoratorを付ける
  @Reference(User)
  authorRef!: FastFireReference<User>
}
// ========

const exec = async () => {
  // IDにより検索
  const user = await FastFire.findById(User, "4Uar6RBThDiI8DTPQalM")
  if (!user) return

  // フィールド名と値はtype safe
  await user.update({ name: "taro" })

  const docs = FastFire.preload(Article, ["authorRef"])
    .where("title", "==", "title")

  // preloadで指定したReferenceが非同期で取得され、whereの結果に注入される
  await docs.forEach((doc) => {
    console.log(doc.authorRef.data.name) // taro
  })
}

exec().catch((e) => console.error(e))
