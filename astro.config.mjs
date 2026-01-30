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
        // Final deployed URL for this project (include repo path for project pages)
        site: 'https://ohkjin.github.io/astro-uaii.github.io/astro-uaii.github.io/',
        // Base path should start and end with a slash for a GitHub Pages project site
        // base: '/astro-uaii.github.io/',
        // Redirects should point to root-relative routes (no repo prefix)
        redirects: {
            '/events.html': '/events',
            // '/events': '/events',
            // '/events-detail': '/events-detail',
            // '/press-detail': '/press-detail',
            // '/': '/',
            '/index.html': '/',
            // '/events/events-detail/[...slug]': '/events-detail/[...slug]',
            // '/events/press-detail/[...slug]': '/press-detail/[...slug]',
            '/events-detail.html': '/events-detail',
            '/press-detail.html': '/press-detail',
        }
});
