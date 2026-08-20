import { http, HttpResponse } from 'msw'
import { categories, makeProduct, makeProductsResponse } from './fixtures'

const BASE = 'https://dummyjson.com'

export const handlers = [
  http.get(`${BASE}/products/categories`, () => {
    return HttpResponse.json(categories)
  }),
  http.get(`${BASE}/products/category/:slug`, ({ request, params }) => {
    const searchParams = new URL(request.url).searchParams
    const limit = Number(searchParams.get('limit') ?? 20)
    const skip = Number(searchParams.get('skip') ?? 0)
    const products = Array.from({ length: limit }, (_, i) =>
      makeProduct({
        id: skip + i + 1,
        title: `${String(params.slug)} product ${skip + i + 1}`,
        category: String(params.slug),
      }),
    )
    return HttpResponse.json(
      makeProductsResponse(limit, { skip, limit, products }),
    )
  }),
  http.get(`${BASE}/products/:id`, ({ params }) => {
    return HttpResponse.json(makeProduct({ id: Number(params.id) }))
  }),
  http.get(`${BASE}/products`, ({ request }) => {
    const searchParams = new URL(request.url).searchParams
    const limit = Number(searchParams.get('limit') ?? 20)
    const skip = Number(searchParams.get('skip') ?? 0)
    return HttpResponse.json(makeProductsResponse(limit, { skip, limit }))
  }),
  http.post(`${BASE}/carts/add`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ id: 1, ...body }, { status: 201 })
  }),
]
