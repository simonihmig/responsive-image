---
'@responsive-image/build-utils': patch
---

Fix a race condition in the image cache that could emit empty or corrupted images

When the same image is imported by multiple modules with the same configuration (e.g. the same image with different `?lqip` or `?aspect` query params), Vite processes those modules concurrently. All of them share the same cache entry, and cache files were written directly to their final path, so one module could read the file while another was still writing it. That read returned an empty (or truncated) buffer, which was then emitted as a broken asset. Because Vite deduplicates assets with identical content, all affected image variants collapsed into a single 0-byte file, producing invalid `srcset` URLs.

Concurrent requests for the same cache entry now share a single in-flight generation, and cache files are written to a temporary file and renamed into place, so readers never observe a partially written entry. Empty cache files are treated as a cache miss. This affects both the Vite and webpack plugins, which share this caching code.
