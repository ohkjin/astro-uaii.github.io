// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    // site: 'https://kaist-uaii.github.io',
    // base: 'kaist-uaii'
    site: 'https://ohkjin.github.io',
    base: 'astro-uaii.github.io',
    redirects: {
   '/events': '/astro-uaii.github.io/events',
   '/events-detail': '/astro-uaii.github.io/events-detail',
   '/press-detail': '/astro-uaii.github.io/press-detail',
   '/index': '/astro-uaii.github.io/',
   '/events-detail/[...slug]': '/astro-uaii.github.io/events-detail/[...slug]',
   '/press-detail/[...slug]': '/astro-uaii.github.io/press-detail/[...slug]',
    }
});
