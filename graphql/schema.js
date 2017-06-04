import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'

import { schema as postsSchema, resolvers as postsResolvers } from './posts'
import { queryPosts, createPost, updatePostWithResponse, findPostById } from './posts/model'

import { POST_NOT_FOUND } from './utils/error'

const rootSchema = [`
enum ErrorCode {
  POST_NOT_FOUND
}

type Query {
  # List all posts
  posts: [Post]

  # Find post by id
  findPostById(id: String!) : PostResponse
}

type Mutation {
  # Create new Post
  createPost(input: PostInput!): PostResponse
  updatePostWithResponse(input: PostUpdateInput): PostResponse
}

schema {
  query: Query
  mutation: Mutation
}
`]

const rootResolvers = {
  Query: {
    posts: () => queryPosts(),
    findPostById: async (root, args) => {
      const post = await findPostById(args.id)
      if (!post) {
        return { error: POST_NOT_FOUND}
      }

      return { post }
    },
  },
  Mutation: {
    createPost: async (root, { input }) => {
      // create a new post
      const post = await createPost(input)

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
