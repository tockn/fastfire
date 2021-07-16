# FastFire🔥

FastFire is a library for working with Firestore quickly and easily.

This is inspired by ActiveRecord.

⚠WIP⚠

## Example

```typescript
import { FastFire } from "./fastfire";

class User extends FastFireDocument {
  name!: string
  bio!: string
}

// Create a new Firestore document
const user1 = await FastFire.create(Hoge, {
  name: "tockn", // type safe!🔥
  bio: "hello world!"
})

// Update a Firestore document
await user1.update({
  bio: "hi!" // type safe!🔥
})

// Search Firestore documents
const users = FastFire.where(
  Hoge, 
  "name", // type safe🔥
  "==", 
  "tockn"
).where(
  "bio", // type safe🔥
  "==",
  "hi!"
)

await users.forEach((user) => {
  console.log(user.name)
})

// Find a Document by ID
await FastFire.findById(user1.id)

```
