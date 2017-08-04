import fs from 'fs'
import { join } from 'path'
import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import { schema as postsSchema, resolvers as postsResolvers } from './posts'
import { queryPosts, createPost, updatePostWithResponse, findPostById } from './posts/model'

import { sendEmail } from './emails/model'

import { POST_NOT_FOUND, SERVER_ERROR } from './utils/error'

const rootSchema = [fs.readFileSync(join(__dirname, 'schema.graphql'), 'utf-8')]

const rootResolvers = {
  Query: {
    posts: () => queryPosts(),
    findPostById: async (root, args) => {
      const post = await findPostById(args.id)
      if (!post) {
        return { error: POST_NOT_FOUND }
      }

      return { post }
    },
  },
  Mutation: {
    createPost: async (root, { input }) => {
      // create a new post
      const post = await createPost(input)
      if (!post) {
        return { error: SERVER_ERROR }
      }

      // send email
      const email = await sendEmail()

      if (!email) {
        return { error: SERVER_ERROR }
      }

      return { post }
    },
    updatePostWithResponse: async (root, { input }) => {
      // validate the post exists
      const postExist = await findPostById(input.id)
      if (!postExist) {
        return { error: POST_NOT_FOUND }
      }

      const post = await updatePostWithResponse(input.id, { ...input })

      return { post }
    },
  },
}

const schema = [...rootSchema, ...postsSchema]
const resolvers = merge(rootResolvers, postsResolvers)

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
})

export default executableSchema
