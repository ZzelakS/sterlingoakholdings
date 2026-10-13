# Sterling Oak Holdings

React + TypeScript + Vite + Tailwind CSS 4, with a TypeScript server-side inquiry endpoint deployed as a Cloudflare Worker.

Run `npm install`, then `npm run dev`. `npm run build` checks TypeScript and packages the client and Worker. Preview mode displays the website; email requests require the deployed Worker.

Brand assets: public/logo.svg, public/logo-mark.svg, public/favicon.svg, public/favicon-32.png, public/apple-touch-icon.png. Editable oak-and-roof mark.

## Resend configuration
Configure production secret `RESEND_API_KEY` and runtime variable `RESEND_FROM_EMAIL` in Sites. Use a sender on a domain verified in your Resend account. Recipient is fixed server-side to sterlingoakholdings2026@gmail.com; Reply-To is the visitor's validated email. No API key belongs in browser code. The resend.dev test sender can only send to your Resend account email.

POST /api/inquiry accepts name, email, interest, message, and an optional honeypot website field. Success appears only after Resend accepts the message. Missing configuration returns an actionable error with the official contact address. No inquiry database is used.

Property imagery is illustrative Unsplash photography, not a claimed portfolio. Fonts load from Google Fonts.

Footer credit preference: use “Lamar” linked to the owner’s WhatsApp with a short introductory message. Omit “built by”. WhatsApp destination: +2349062288078. Message: “Hi Lamar, I saw your work on Sterling Oak Holdings.”

Gold version: four luxury-property inspiration images crossfade every 5.5 seconds. Numbered controls and Play/Pause are provided; autoplay stops for reduced-motion preferences. Original gold tree/roof/name cutout is used in navbar, footer, and PNG favicon.
Image asset edited with built-in imagegen. Prompt: Extract the gold oak tree, rooftop, STERLING OAK and HOLDINGS; remove background, circular border, and all lower text; preserve gold coloring and lettering; output transparent PNG.
