# Thanh Dat Nguyen (阮成達) · Personal Research Portfolio

Homework #1 for **Generative AI (Fall 2026)**: a personal portfolio website built with generative AI as a design and coding collaborator.

- **Live website:** https://fusika1203.github.io/
- **Source code:** https://github.com/Fusika1203/Fusika1203.github.io
- **Student:** Thanh Dat Nguyen · 阮成達 · Student ID **M1461025**
- **Program:** Master's Program in Artificial Intelligence (人工智慧碩士班), Chang Gung University

## Sections

| Section | Contents |
|---------|----------|
| About | Name in English and Chinese, student ID, program, lab, short bio, profile links |
| Education & Experience | Degrees, thesis, coursework, research and teaching-assistant positions |
| Skills & Certificates | Statistical/data analysis, wet-lab, and quantum computing skills; 4 featured certificates (IBM Quantum badges, UTokyo GCI World) with a lightbox and Credly verification links |
| Research | Research interests (including quantum machine learning), the selected research project (lung metastasis in breast cancer) with a workflow figure, and the list of research projects |
| Publications | 10 papers with abstracts and filters (journal / conference / first author) |
| Awards & Achievements | 14 awards with a photo lightbox |
| Contact | Email, Google Scholar, ORCID, GitHub |

## Tech

Plain HTML, CSS and JavaScript. There is no framework and no build step, so the folder can be served as it is by GitHub Pages or any static host.

- `index.html`: all content. It stays readable with JavaScript turned off.
- `css/styles.css`: design tokens (light and dark), layout, and components.
- `js/main.js`: progressive enhancements: theme toggle, mobile menu, scroll-spy, publication filters, "show all awards", lightbox, copy-email.
- `assets/img/`: WebP images at 640 px (thumbnails) and 1600 px (lightbox); certificates and badges are in `assets/img/certs/`.

The design direction comes from the `ui-ux-pro-max` skill: the "Minimalism & Swiss Style" design system with Figtree for headings and Noto Sans for body text, recolored to a blue / sky-blue palette (every colour pair checked for WCAG AA contrast in light and dark mode). The skill output and the overrides are included in the homework submission under `design-system/thanh-dat-nguyen-portfolio/` (`MASTER.md`, `pages/home.md`).

## Run locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push this folder to a public GitHub repository.
2. In **Settings → Pages**, set the source to *Deploy from a branch*, then pick `main` and `/ (root)`.
3. The site is published at `https://<username>.github.io/<repo>/`.

## Credits

- Icons: [Lucide](https://lucide.dev/) (ISC license), inlined as an SVG sprite.
- Fonts: Figtree, Noto Sans, and Noto Sans TC from Google Fonts (SIL Open Font License).
- Award photos and certificates come from the author's own collection; the Tan Tao University campus photo is from [ttu.edu.vn](https://ttu.edu.vn/co-gi-tai-truong-dai-hoc-tan-tao-2/).
