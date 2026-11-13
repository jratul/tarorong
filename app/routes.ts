import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    route('cards', 'routes/cards.tsx'),
    route('cards/:id', 'routes/card-detail.tsx'),
    route('draw', 'routes/draw.tsx'),
    route('result', 'routes/result.tsx'),
  ]),
] satisfies RouteConfig
