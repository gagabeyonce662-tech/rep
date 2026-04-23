// Example structure
const GET_ALL_COLLECTIONS = `#graphql
  query GetAllCollections($first: Int, $after: String) {
    collections(first: $first, after: $after) {
      nodes {
        id
        title
        handle
        image { id url altText }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as const;

export default GET_ALL_COLLECTIONS;

// This file defines a GraphQL query to fetch all collections with pagination support. The query retrieves the collection's id, title, handle, and image details (id, url, altText). The pageInfo field is included to determine if there are more collections to fetch and to get the cursor for the next page.

