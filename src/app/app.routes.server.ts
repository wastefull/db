import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'object/:id',
    renderMode: RenderMode.Server, // SSR only, not prerendered
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
