# Paramba Quantum Website

A responsive React + Vite website for Paramba Quantum, including a browser-based Vapi voice demo.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder, run:

   ```bash
   npm install
   npm run dev
   ```

3. Open the local URL printed by Vite.

## Vapi configuration

The `.env.local` file contains the Vapi **Public** API key and assistant ID supplied for this project. These Vite variables are embedded in the browser bundle and are not private secrets. In the Vapi Dashboard, restrict the Public API key to the production website origin and allow only the intended demo assistant.

For a deployment, add these environment variables in your hosting provider's project settings:

- `VITE_VAPI_PUBLIC_KEY`
- `VITE_VAPI_ASSISTANT_ID`

Then rebuild and redeploy. Do not use a Vapi Private API token in frontend code.

## Deploy

This project can be deployed to Netlify, Vercel, or another static host that supports Vite.

- Build command: `npm run build`
- Publish directory: `dist`
- Add the two Vapi environment variables before building.
- The site must be served over HTTPS for microphone access.

## Voice demo notes

The demo uses the official `@vapi-ai/web` SDK and starts the existing assistant in the visitor's browser. It requests microphone permission after the visitor presses Start, shows connection errors, and automatically ends the session after three minutes. Actual successful voice connectivity still depends on the Vapi assistant configuration, public-key restrictions, account balance, browser permissions, and network/WebRTC availability. Test a real session after deployment.

## Contact

The enquiry form opens WhatsApp with a pre-filled message to the business number supplied for Paramba Quantum. Visitors must press Send in WhatsApp to submit the enquiry.
