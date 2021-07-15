import firebase from "firebase";
import { ActiveFire } from "./active_fire";

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

class Hoge extends ActiveFire {
  name!: string
  createdAt!: Date
}

console.log("hello")
const exec = async () => {
  const hoge = await Hoge.findById<Hoge>("hoge")
  console.log(hoge)

  await hoge?.update({ name: "oreeeee" })
}

exec().catch((e) => console.error(e))
