import firebase from "firebase";
import { FastFireDocument } from "./index";
import { FastFire } from "./index";

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

class Hoge extends FastFireDocument {
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
