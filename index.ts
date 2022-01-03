import { FastFire, FastFireDocument } from './src';
import firebase from 'firebase/compat/app';
import { FastFireField } from './dist';

// const firebaseConfig = {
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyBeNk3HlfxpCz7VM0M7dlBSKgD5lxs2LLg',
  authDomain: 'desktour-dev.firebaseapp.com',
  projectId: 'desktour-dev',
  storageBucket: 'desktour-dev.appspot.com',
  messagingSenderId: '422473705553',
  appId: '1:422473705553:web:43d7b2a303d38f7eb77070',
};

firebase.initializeApp(firebaseConfig);

FastFire.initialize(firebase.firestore());

export class Desk extends FastFireDocument<Desk> {
  @FastFireField()
  mainImageUrl!: string;

  @FastFireField()
  description!: string;

  @FastFireField()
  tags!: string[];

  @FastFireField()
  createdAt!: Date;
}

const exec = async () => {
  const desk = await FastFire.findById(Desk, '28qSVhNds05fKyxqcuBy');
  console.log(desk);
};

exec().catch(e => console.error(e));
