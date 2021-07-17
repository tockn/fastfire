# FastFire🔥

FastFire is a library for working with Firestore quickly and easily.

This is inspired by ActiveRecord.

⚠WIP⚠

## Example

```typescript

class User extends FastFireDocument {
  name!: string
  bio!: string
}

class Article extends FastFireDocument<Article> {
  title!: string
  body!: string

  @Reference(User)
  authorRef!: FastFireReference<User>
}

// Create a new Firestore document
const user1 = await FastFire.create(User, {
  name: "tockn", // type safe!🔥
  bio: "hello world!" // type safe!🔥
})

// Update a Firestore document
await user1.update({
  bio: "hi!" // type safe!🔥
})

// Search Firestore documents with preload reference
const articles = FastFire
  .preload(Article, ["authorRef"])
  .where("bio", "==", "hi!")

// authorRef is also fetched and inject to Article instance asynchronously by preloader
await articles.forEach((article) => {
  console.log(article.authorRef.data.name)
})

// Find a Document by ID
await FastFire.findById(user1.id)

```
