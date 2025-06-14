## Frontend - Next.js

This is the frontend for the hotel application, built with [Next.js](https://nextjs.org), React, and TypeScript.

### Requirements

* Node.js >= 18.x
* npm >= 9.x

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the `.env.local` file.

### Running in Development Mode

```bash
npm run dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

### Building and Running in Production

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

### Project Structure

* `components/` – reusable components
* `public/` – static assets (e.g., images)
* `api/` – API routes
* `lib/` – utility functions and types

### Testing

Run unit tests (if available):

```bash
npm test
```

### Linting

To check the code for stylistic errors:

```bash
npm run lint
```

### Technologies

* Next.js
* React
* TypeScript
* Material UI
* next-i18next (for internationalization)
