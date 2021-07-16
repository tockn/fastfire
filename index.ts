import { FastFire, FastFireDocument } from "./src";

import firebase from "firebase";

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

class Hoge extends FastFireDocument<Hoge> {
  name!: string
  description!: string
}

console.log("hello")
const exec = async () => {

  await FastFire.create(Hoge, {
    name: "すごい",
    description: "型の気持ちがわかってきた"
  })

  const hoge = await FastFire.findById(Hoge,"hoge")
  await hoge?.update({
    name: "fuga"
  })
  console.log(hoge?.description)

  await FastFire.where(Hoge, "name", "==", "tockn").forEach((d) => {
    console.log(d)
  })

  await FastFire.where(Hoge, "name", "==", "tockn").forEach((d) => {
    console.log(d)
  })

  console.log({name: "tockn"})
}

exec().catch((e) => console.error(e))
