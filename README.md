Welcome to the new Guidance Front End. This project is built using react and vite as a bundler. Currently we only have one real page at '/guidance'

## Install Dependencies

### Install NVM

You check/ verify by running

`nvm -v`

and it should response with a version

then run `nvm install 20.11`

### Install Node Dependencies

then run `nvm use` at the root of the repo to actually switch to node 20.11

`npm install`

## Create Env variables

Create a .env file at the root of the app with the following contents

```
VITE_GUIDANCE_SERVER_URL=<server_url>
```

server url could be a local or remote server

# Run React App

`npm run dev`

## Design + Packages

This repo uses React with the help of [PrimeReact](https://primereact.org/) for pre-made components. We can also use scss in any of our components for simpler CSS definitions.

## Linting

TODO: fix linting add husky and pre-commit settings
