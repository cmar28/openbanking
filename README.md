# OpenBanking Demo

This repository contains a simple web application that retrieves and displays
Starling Bank account information. The goal is to provide a minimal example of
how to integrate with the Starling Bank public API using a personal access
token.

## Architecture Overview

The application is designed as a small web service consisting of two parts:

1. **Backend** – A lightweight Node.js server built with Express. It acts as a
   proxy between the browser and the Starling Bank API. The server is
   responsible for securely storing the Starling personal access token,
   requesting account data from Starling, and exposing simplified REST
   endpoints to the front end.
2. **Frontend** – A single-page application (SPA) written with React. It fetches
   data from the backend and renders the user's account balances, transactions
   and other details. The frontend communicates only with our Node.js server –
   never directly with Starling – which keeps the access token on the server
   side.

This simple separation allows the user interface to remain secure while keeping
backend code minimal.

## Starling Bank API

Starling provides a comprehensive REST API. The simplest approach for testing is
to create a **Personal Access Token** in your Starling developer account. The
token must be supplied to the backend via an environment variable
(`STARLING_PERSONAL_TOKEN`) so it can authenticate to Starling's API endpoints.

For production-grade integrations you may register a client application which
provides a **Client ID** and **Client Secret** for OAuth flows. If you use this
method, store the credentials in environment variables such as
`STARLING_CLIENT_ID` and `STARLING_CLIENT_SECRET`.

The official documentation can be found at
<https://developer.starlingbank.com/docs>.

## Getting Started

1. Install Node.js and npm.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with at least `STARLING_PERSONAL_TOKEN=<your token>`.
   If using OAuth, also set `STARLING_CLIENT_ID` and `STARLING_CLIENT_SECRET`.
4. Start the development server with `npm start`.
5. Navigate to <http://localhost:3000> to see your account data.

## Repository Status

At the moment the repository only contains this README. Subsequent commits will
add the backend and frontend source code.

