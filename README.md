# tipstar

A browser extension that allows users to support the creators on the web directly using Razorpay.

## Usage
1. Click "Support this site" button in the extension popup on any active tab.
2. If not already logged in, login using the credentials `hello@pavi2410.me` and `testpw123`.
3. After you're logged in, you'll be asked to enter an amount you want to support the site with.
4. After that, you'll be presented the payment link with a button on which you can click to proceed to the Razopay's payment flow.
5. Upon successful payment, you'll receive a confirmation email describing the payment information along with the invoice of the transaction.
6. Congrats, you just supported your favourite web creator! 

## Instructions to Run

### Folders

- `src` - main source.
  - `contentScript` - scripts and components to be injected as `content_script`
  - `background` - scripts for background.
  - `styles` - styles shared in popup and options page
  - `manifest.ts` - manifest for the extension.
- `extension` - extension package root.
  - `assets` - static assets.
  - `dist` - built files, also serve stub entry for Vite on development.
- `scripts` - development and bundling helper scripts.

### Development

First of all, make sure you have Node.js and npm installed.

Then, run the following commands

```bash
npm install
```

```bash
npm dev
```
(Keep this window running)

To load the extension in the browser, you can run the following command on a new terminal window:

| Firefox | Chrome |
|---|---|
| ```npm start:firefox``` | ```npm start:chromium``` |

### Build

To build the extension, run

```bash
npm build
```

And then pack files under `extension`, you can upload `extension.crx` or `extension.xpi` to appropriate extension store.

## Credits

This repo was made based on https://github.com/antfu/vitesse-webext
