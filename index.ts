import firebase from "firebase";
import { ActiveFireDocument } from "./src/active_fire_document";
import { ActiveFire } from "./src/active_fire";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};
firebase.initializeApp(firebaseConfig);

ActiveFire.initialize(firebase.firestore())

class Hoge extends ActiveFireDocument {
  name!: string
  description!: string
}

console.log("hello")
const exec = async () => {

  const hoge = await ActiveFire.findById(Hoge,"hoge")
  console.log(hoge?.description)

  await ActiveFire.where(Hoge, "name", "==", "tockn").forEach((d) => {
    console.log(d)
  })

  console.log({name: "tockn"})
}

exec().catch((e) => console.error(e))
