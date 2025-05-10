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
# Example: u-s4t2ud-63b1e7c5cdf76e52e3ad7264504ab99364dbf5f568d3a653b41825bc4878a731

FORTYTWO_CLIENT_SECRET="YOUR_42_CLIENT_SECRET"
# Example: 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

NEXT_PUBLIC_APP_URL="YOUR_APP_BASE_URL"
# This is the base URL of your application.
# Example for local development: "http://localhost:9002"
# Example for deployed (from your screenshot): "https://6000-firebase-studio-1746805799490.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev"

NEXT_PUBLIC_FORTYTWO_REDIRECT_URI="YOUR_FULL_42_APP_REDIRECT_URI"
# This MUST be the EXACT Redirect URI registered in your 42 OAuth application settings.
# It will typically be NEXT_PUBLIC_APP_URL + "/login".
# Example for local development: "http://localhost:9002/login"
# Example for deployed (from your screenshot): "https://6000-firebase-studio-1746805799490.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev/login"
# Ensure this full URL is listed in your 42 app's "Redirect URI" field(s) and exactly matches.
```

**Important:**
-   `NEXT_PUBLIC_FORTYTWO_CLIENT_ID` is your 42 application's UID.
-   `FORTYTWO_CLIENT_SECRET` is your 42 application's Secret.
-   `NEXT_PUBLIC_APP_URL` should be the base URL of your application (e.g., `http://localhost:9002` for local development, or your production domain, **without** a trailing slash).
-   `NEXT_PUBLIC_FORTYTWO_REDIRECT_URI` is the **full and exact** callback URL that 42 will redirect users to after authentication. The path is `/login`. This URI must be **identical** to what you have configured in your 42 OAuth application settings. Check for typos, HTTP vs HTTPS, and trailing slashes.

**After setting up or modifying your `.env` file, you MUST restart your Next.js development server for the changes to take effect.**
