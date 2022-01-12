<div align="center">
  <h1>FastFire🔥</h1>
<a href="https://www.npmjs.com/package/fastfire"><img src="https://img.shields.io/npm/v/fastfire.svg?style=flat" /></a>

```
$ npm install --save fastfire
or
$ yarn add fastfire
```
</div>

⚠WIP⚠

## What is FastFire?

FastFire is the Firestore ORM library for quick and easy development written in TypeScript.

Just define a FastFireDocument class and FastFire will take care of all the hassle of implementing things like storing and retrieving data, mapping to instances, and more.

It also enables more rapid development by implementing business logic within the FastFireDocument class. Yes, this is the Active Record pattern.

FastFire is strongly inspired by ActiveRecord.

(Of course, this is type safe in various situations)

## Getting started

### Setup FastFire

Setup Firebase config and call `FastFire.initialize` method with firestore instance.

```typescript
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
firebase.initializeApp(firebaseConfig);

FastFire.initialize(firebase.firestore());
```

### Define FastFireDocument

Define a class to treat as a Firebase document and extends `FastFireDocument` in that class.

```typescript
@FastFireCollection("User")
class User extends FastFireDocument<User> {
  // You need to write `FastFireField` decorator on the Firestore document field props.
  @FastFireField()
  name!: string
  @FastFireField()
  bio!: string
}

@FastFireCollection("Article")
class Article extends FastFireDocument<Article> {
  @FastFireField()
  title!: string
  @FastFireField()
  body!: string

  // You need to write `FastFireReference` decorator on the Firestore Reference Type document field props.
  @FastFireReference(User)
  author!: User
}
```


### Create a Document

```typescript
const user = await FastFire.create(User, {
  name: "tockn", // type safe!🔥
  bio: "hello world!" // type safe!🔥
})
```

### Fetch Document

- By document id

```typescript
const user = await FastFire.findById(User, "AKDV23DI97CKUQAM")
```

- Using query

```typescript
const users = await FastFire.where(User, "name", "==", "tockn")
                      .where("bio", "==", "hello world!")
                      .limit(1)
                      .get()
```

### Update or Delete Document

```typescript
const user = await FastFire.findById(User, "AKDV23DI97CKUQAM")

await user.update({ name: "Ohtani-San" })

await user.delete()
```

### Reference Type and Preloading

Create a document with Reference Type field.

```typescript
const user = await FastFire.findById(User, "AKDV23DI97CKUQAM")

await FastFire.create(Article, {
  title: "big fly!",
  body: "suwatte kuda sai",
  author: user // author is Reference Type field
})
```

Reference Type field can be preloaded asynchronously by using the preload method.

```typescript
// preload author field asynchronously.
const articles = await FastFire.preload(Article, ["author"]).where("title", "==", "big fly!").get()

articles.forEach((article) => {
  // Because it is preloaded, you can get the author's name
  console.log(article.author.name) // => tockn
})
```

### Get realtime updates

You can get document updates in realtime.

```typescript
const user = await FastFire.findById(User, "AKDV23DI97CKUQAM")

user.onChange((updatedUser) => {
  console.log(updatedUser)
})
```

You can also get changes in query results in real time.

```typescript
const users = await FastFire.where(User, "name", "==", "tockn").where("bio", "==", "hello world!")

users.onResultChange((updatedUsers) => {
  console.log(updatedUsers)
})
```

### Validation

You can implement validations using the argument of FastFireField decorator.

- Required Field Validation

```typescript
@FastFireCollection("User")
class User extends FastFireDocument<User> {
  @FastFireField({ required: true} )
  name!: string
  @FastFireField()
  bio!: string
}

await FastFire.create(User, { bio: "hello" }) // DocumentValidationError: "User" body: name is required.
```

- Custom Validation

```typescript
@FastFireCollection("User")
class User extends FastFireDocument<User> {
  @FastFireField({ validate: User.validateName })
  name!: string
  
  static validateName(name: string): ValidationResult {
    if (name.length > 100) return "name is too long!"
  }
}

await FastFire.create(User, { bio: "hello" }) // DocumentValidationError: "User" name: name is too long!
```

[//]: # (### Transaction)

[//]: # ()
[//]: # (Transaction is also supported!)

[//]: # ()
[//]: # (```typescript)

[//]: # (FastFire.runTransaction&#40;async transaction => {)

[//]: # (  const user = await transaction.findById&#40;User, "AKDV23DI97CKUQAM"&#41;)

[//]: # (  if &#40;!user&#41; return)

[//]: # (  )
[//]: # (  await transaction.update&#40;user, { bio: "tx is working!"} &#41;)

[//]: # (}&#41;)

[//]: # (```)
