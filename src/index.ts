import { FastFire } from "./fastfire";

export * from './fastfire'
export * from './fastfire_document'
export * from './where_chain'

export * from './types'

import firebase from "firebase";
import { FastFireDocument } from "./fastfire_document";
import { FastFireReference, reference } from "./fastfire_reference";

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

class User extends FastFireDocument<User> {
  name!: string
  bio!: string
}

// @ts-ignore
class Article extends FastFireDocument<Article> {
  title!: string
  body!: string

  @reference(User)
  author!: FastFireReference<User>
}

console.log("hello")
const exec = async () => {
  // const user = await FastFire.findById(User, "4Uar6RBThDiI8DTPQalM")
  // if (!user) {
  //   console.log("empty")
  //   return
  // }
  //
  // const article = await FastFire.create(Article, {
  //   title: "titile",
  //   body: "body",
  //   author: user
  // })
  // console.log(article)

  const article = await FastFire.findById(Article, "ZcbQ6gnMFIHGAFtafvLy")
  if (!article) return
  // const author = await article.author.find()
  await article.preload(["author"])
  console.log(article)
}

exec().catch((e) => console.error(e))
