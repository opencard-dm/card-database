import fs from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
// use version 11.3.0 
// https://github.com/firebase/firebase-admin-node/issues/2276
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
if (fs.existsSync('.credentails.json')) {
  const serviceAccount = JSON.parse(fs.readFileSync('.credentails.json', {
    encoding: 'utf8'
  }))
  initializeApp({
    credential: cert(serviceAccount)
  });
} else {
  initializeApp();
}

export class FireStore {
  static db = getFirestore()
  static env = env
  static Timestamp = Timestamp
}
