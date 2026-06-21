# Vixora Agency Website

Plain HTML/CSS/JS — no build step, no npm install. Works directly on GitHub Pages.

## Pages
- `index.html` — Home
- `about.html` — About
- `services.html` — Services
- `portfolio.html` — Portfolio (image gallery + lightbox + video project cards)
- `contact.html` — Contact (form + WhatsApp CTA)

## 1. Push to GitHub Pages
1. Create a new GitHub repo (e.g. `vixora-agency`).
2. Upload everything in this folder to the repo root.
3. Repo → Settings → Pages → Source: `main` branch, `/ (root)`.
4. GitHub gives you a `username.github.io/vixora-agency` URL within a minute or two.
5. To use your own domain (`vixora.agency`): Settings → Pages → Custom domain →
   enter `vixora.agency`, then add the DNS records GitHub shows you at your
   domain registrar (usually one A record + one CNAME, or 4 A records for an
   apex domain). It can take a few hours to go live.

## 2. Turn on the contact form (2 minutes)
The form in `contact.html` currently falls back to opening the visitor's email
app. To make it submit directly without leaving the page:
1. Go to https://formspree.io and create a free account.
2. Create a new form, copy the endpoint (looks like `https://formspree.io/f/abc12345`).
3. Open `contact.html`, find the `<form id="contact-form" action="mailto:...">`
   line, and replace the `action` value with your Formspree endpoint.
That's it — `js/main.js` already knows how to submit to Formspree once the
real endpoint is in place.

## 3. Adding your real video files later
Each video project on `portfolio.html` currently shows a styled placeholder
(gradient + play icon) instead of real footage, by design — drop your actual
files in later:
- Easiest: upload each video to YouTube (unlisted is fine) and swap the
  placeholder `<div class="pf-media ...">` block for an `<iframe>` embed.
- Or self-host: compress the video (HandBrake, target under ~15MB for a
  30–60s clip), put it in `assets/video/`, and replace the placeholder with
  a `<video controls poster="...jpg"><source src="assets/video/yourfile.mp4"></video>`.
A matching comment block in `index.html`'s hero section also shows exactly
how to drop in a looping background video later, without touching any CSS.

## 4. Replacing/adding portfolio images
Images live in `assets/portfolio/`. Add new ones there and follow the same
markup pattern used for `pos-1.jpg` … `pos-9.jpg` in `portfolio.html`
(an `<a class="gallery-item" data-lightbox>` wrapping an `<img>`).

## 5. Editing contact details
Phone, email, Facebook and Instagram links appear in the footer of every
page and on `contact.html`. Use find-and-replace across all five `.html`
files if any of these change.

## 6. Brand assets
- `assets/brand/logo-icon.png` — monogram only, used in the navbar/favicon.
- `assets/brand/logo-full.png` — full lockup with "VIXORA" wordmark, used in
  the footer and About page.
Both have transparent backgrounds and were cropped from your original logo file.

## 7. Testimonials
The Testimonials section on the home page is intentionally left as labeled
placeholders. Once a client agrees to a quote being published, replace the
placeholder paragraph and "Client name / Company" text in the `.testi-card`
blocks in `index.html`.
