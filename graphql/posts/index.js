export const schema = [`
input PostInput {
  name: String!
  title: String!
  content: String!
  reply: String
  email: String!
  title: String!
}

input PostUpdateInput {
  id: String!
  reply: String!
}

type PostResponse {
  post: Post
  error: ErrorCode
}

type Post {
  id: ID!
  name: String!
  title: String!
  content: String!
  reply: String
  email: String!
  createdAt: String!
  updatedAt: String!
}
`]

export const resolvers = {}

export default {}
