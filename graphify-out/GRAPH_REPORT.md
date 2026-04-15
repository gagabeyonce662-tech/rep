# Graph Report - .  (2026-04-15)

## Corpus Check
- 74 files · ~54,007 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 200 nodes · 167 edges · 64 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]

## God Nodes (most connected - your core abstractions)
1. `AppSession` - 10 edges
2. `redirectIfHandleIsLocalized()` - 6 edges
3. `useAside()` - 5 edges
4. `loader()` - 3 edges
5. `handler()` - 3 edges
6. `buildOrderSearchQuery()` - 3 edges
7. `loader()` - 3 edges
8. `loader()` - 3 edges
9. `loadCriticalData()` - 3 edges
10. `loader()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Header()` --calls--> `useAside()`  [INFERRED]
  app\components\Header.tsx → app\components\Aside.tsx
- `SearchFormPredictive()` --calls--> `useAside()`  [INFERRED]
  app\components\SearchFormPredictive.tsx → app\components\Aside.tsx
- `SearchResultsPredictive()` --calls--> `useAside()`  [INFERRED]
  app\components\SearchResultsPredictive.tsx → app\components\Aside.tsx
- `loadCriticalData()` --calls--> `redirectIfHandleIsLocalized()`  [INFERRED]
  app\routes\blogs.$blogHandle.$articleHandle.tsx → app\lib\redirect.ts
- `loadCriticalData()` --calls--> `redirectIfHandleIsLocalized()`  [INFERRED]
  app\routes\blogs.$blogHandle._index.tsx → app\lib\redirect.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.2
Nodes (1): AppSession

### Community 1 - "Community 1"
Cohesion: 0.24
Nodes (4): loader(), buildOrderSearchQuery(), parseOrderFilters(), sanitizeFilterValue()

### Community 2 - "Community 2"
Cohesion: 0.2
Nodes (2): Logout(), action()

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (5): Aside(), useAside(), Header(), SearchFormPredictive(), SearchResultsPredictive()

### Community 4 - "Community 4"
Cohesion: 0.38
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (3): createHydrogenRouterContext(), handleRequest(), handler()

### Community 6 - "Community 6"
Cohesion: 0.38
Nodes (4): loadCriticalData(), loadDeferredData(), loader(), redirectIfHandleIsLocalized()

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 0.47
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (2): ProductItem(), useVariantUrl()

### Community 10 - "Community 10"
Cohesion: 0.6
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 11 - "Community 11"
Cohesion: 0.6
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 12 - "Community 12"
Cohesion: 0.6
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 13 - "Community 13"
Cohesion: 0.6
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 14 - "Community 14"
Cohesion: 0.6
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 15 - "Community 15"
Cohesion: 0.6
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 0.83
Nodes (3): loadCriticalData(), loadDeferredData(), loader()

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 0.83
Nodes (3): generalDisallowRules(), loader(), robotsTxtData()

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (2): SearchForm(), useFocusOnCmdK()

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 0.67
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 0.67
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 28`** (2 nodes): `index.js`, `handler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `AddToCartButton()`, `AddToCartButton.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `CartMain.tsx`, `getLineItemChildrenMap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `MobileBottomNav.tsx`, `MobileBottomNav()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `MockShopNotice.tsx`, `MockShopNotice()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `ProductImage.tsx`, `ProductImage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `SearchResults.tsx`, `SearchResults()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `Button.tsx`, `Button()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `loader()`, `account._index.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `loader()`, `account_.authorize.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `loader()`, `account_.login.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (2 nodes): `discount.$code.tsx`, `loader()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (2 nodes): `sitemap.$type.$page[.xml].tsx`, `loader()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (2 nodes): `[sitemap.xml].tsx`, `loader()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `customer-accountapi.generated.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `react-router.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `server.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `storefrontapi.generated.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `entry.client.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `CartLineItem.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `CartSummary.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `Footer.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `PageLayout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `PaginatedResourceSection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `ProductForm.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `ProductPrice.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `CustomerAddressMutations.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `CustomerDetailsQuery.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `CustomerOrderQuery.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `CustomerOrdersQuery.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `CustomerUpdateMutation.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `fragments.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `redirectIfHandleIsLocalized()` connect `Community 6` to `Community 8`, `Community 10`, `Community 11`, `Community 14`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `loadCriticalData()` connect `Community 8` to `Community 6`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `loadCriticalData()` connect `Community 10` to `Community 6`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `redirectIfHandleIsLocalized()` (e.g. with `loadCriticalData()` and `loadCriticalData()`) actually correct?**
  _`redirectIfHandleIsLocalized()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `useAside()` (e.g. with `Header()` and `SearchFormPredictive()`) actually correct?**
  _`useAside()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `handler()` (e.g. with `createHydrogenRouterContext()` and `handleRequest()`) actually correct?**
  _`handler()` has 2 INFERRED edges - model-reasoned connections that need verification._