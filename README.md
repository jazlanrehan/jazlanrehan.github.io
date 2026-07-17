# jazlanrehan.github.io

Personal portfolio website for **Jazlan Rehan** — Web Developer, SEO Specialist & Digital Marketing Expert.

## What's in this site

- **Home, About, Services, Resume, Blog, Contact** pages
- **6 project case studies** (Web Development, SEO, Digital Marketing)
- **4 blog posts** with custom infographics
- Custom dropdowns (no native `<select>` anywhere)
- Functional contact/hire forms via Formspree + WhatsApp fallback
- Fully responsive, SEO-optimized (meta tags, schema, sitemap)

## ⚠️ One-time setup required: Contact Form

The "Hire Me" and "Contact" forms use **Formspree** (a free service) to actually deliver
messages to your email, since GitHub Pages can't run server-side code (PHP, etc.).

**To activate your forms (takes 2 minutes):**

1. Go to **https://formspree.io** and sign up for a free account.
2. Create a new form and copy your **Form ID** (it looks like `abcdwxyz`).
3. Open `assets/js/custom.js` in this project.
4. Find this line near the top:
   ```js
   var FORMSPREE_FORM_ID = "YOUR_FORMSPREE_ID"; // <-- replace this
   ```
5. Replace `YOUR_FORMSPREE_ID` with your real Form ID.
6. Save, commit, and push. Your forms will now email you directly.

Until you do this, the forms will show a friendly message asking visitors to use the
WhatsApp button instead — so nothing is broken, you just won't receive emails yet.

## WhatsApp Number

The WhatsApp number used across the site (floating button, forms, footer) is set in two places:
- `assets/js/custom.js` → `WHATSAPP_NUMBER` variable
- Various `wa.me/923110736712` links throughout the HTML files

If you ever change your number, search-and-replace `923110736712` across all files.

## Deploying

This is a static site — just push to the `main` branch of your `username.github.io`
repository and GitHub Pages will serve it automatically. No build step needed.

## Folder structure

```
/projects/   → case study pages
/posts/      → blog post pages
/assets/css/custom.css → new component styles (dropdowns, WhatsApp button, etc.)
/assets/js/custom.js   → dropdown logic + form handling
```
