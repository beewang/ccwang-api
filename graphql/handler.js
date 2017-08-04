import { graphql } from 'graphql'
import schema from './schema'

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
