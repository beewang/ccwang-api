import uuid from 'uuid'
import { doc } from 'serverless-dynamodb-client'

export const queryPosts = () => (
  new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.DYNAMODB_POSTS_TABLE,
    }

    doc.scan(params, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve(data.Items)
    })
  })
)

export const findPostById = id => (
  new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.DYNAMODB_POSTS_TABLE,
      Key: { id },
    }

    doc.get(params, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve(data.Item)
    })
  })
)


export const updatePostWithResponse = (id, post) => (
  new Promise((resolve, reject) => {
    const updatedAt = new Date().getTime()

    const params = {
      TableName: process.env.DYNAMODB_POSTS_TABLE,
      Key: { id },
      UpdateExpression: 'set reply=:reply, updatedAt=:updatedAt',
      ExpressionAttributeValues: {
        ':reply': post.reply,
        ':updatedAt': updatedAt,
      },
    }

    doc.update(params, async (err) => {
      if (err) {
        reject(err)
        return
      }

      const updatedPost = await findPostById(id)

      resolve(updatedPost)
    })
  })
)

export const createPost = post => (
  new Promise((resolve, reject) => {
    const timestamp = new Date().getTime()
    const id = uuid.v4()
    const params = {
      TableName: process.env.DYNAMODB_POSTS_TABLE,
      Item: {
        id,

        name: post.name,
        title: post.title,
        content: post.content,
        reply: post.reply,
        email: post.email,

        createdAt: timestamp,
        updatedAt: timestamp,
      },
    }

    doc.put(params, async (err) => {
      if (err) {
        reject(err)
        return
      }

      const createdPost = await findPostById(id)

      resolve(createdPost)
    })
  })
)

export default {}
