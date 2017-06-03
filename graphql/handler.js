import { graphql } from 'graphql'
import dotenv from 'dotenv'
import schema from './schema'

dotenv.config()

export const handler = (event, _, callback) => {
  const { query, variables } = event.body
  const context = {
    user: { id: event.principalId },
  }
  graphql(schema, query, null, context, variables)
    .then(response => callback(null, response))
    .catch(error => callback(error))
}

export default {}
