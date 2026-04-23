
export const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    availableForSale
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

// Add to app/lib/queries.ts

export const ALL_COLLECTIONS_WITH_PRODUCTS_QUERY = `#graphql
  fragment CollectionProduct on Product {
    id
    handle
    title
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    availableForSale
  }
  
  fragment CollectionWithProducts on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 4) {
      nodes {
        ...CollectionProduct
      }
    }
  }
  
  query AllCollectionsWithProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int = 10
  ) @inContext(country: $country, language: $language) {
    collections(first: $first) {
      nodes {
        ...CollectionWithProducts
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as const;