
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

Create a `.env` file in the root of your project and add the following environment variables. Replace placeholder values with your actual credentials.

### Firebase Configuration (Optional - if using Firebase features)

```env
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
```

If you are not using Firebase services that require these (like Firebase Auth, Firestore through Firebase SDK directly), you can leave the default placeholder values if the application checks allow it, or use mock values. Note that the current `src/lib/firebase.ts` might throw an error if critical Firebase configs are placeholders and Firebase services are initialized.

### 42 OAuth Configuration

To enable "Sign in with 42" functionality, you need to register an application with the 42 Intra API and obtain a Client ID and Client Secret.

```env
NEXT_PUBLIC_FORTYTWO_CLIENT_ID="YOUR_42_CLIENT_ID"
FORTYTWO_CLIENT_SECRET="YOUR_42_CLIENT_SECRET"
NEXT_PUBLIC_FORTYTWO_REDIRECT_URI="YOUR_APP_CALLBACK_URL" 
# Example for local development: http://localhost:9002/auth/callback/42
# This URL MUST be added to your 42 OAuth application's allowed redirect URIs.

NEXT_PUBLIC_APP_URL="http://localhost:9002" 
# Base URL of your application, used to construct the redirect URI. Update for production.
```

**Important:** 
- `NEXT_PUBLIC_FORTYTWO_CLIENT_ID` is your 42 application's UID.
- `FORTYTWO_CLIENT_SECRET` is your 42 application's Secret.
- `NEXT_PUBLIC_FORTYTWO_REDIRECT_URI` is the callback URL that 42 will redirect users to after authentication. This path is `/auth/callback/42` in this application. Ensure the full URL (e.g., `http://localhost:9002/auth/callback/42` or your production equivalent) is registered in your 42 application settings.
- `NEXT_PUBLIC_APP_URL` should be the base URL of your application (e.g., `http://localhost:9002` for local development).

After setting up your `.env` file, restart your development server for the changes to take effect.
