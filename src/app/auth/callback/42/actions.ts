
'use server';

import type { CustomUser } from '@/contexts/AuthContext'; // Assuming CustomUser is exported

interface FortyTwoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

interface FortyTwoErrorResponse {
  error: string;
  error_description: string;
}

interface FortyTwoUser {
  id: number;
  email: string;
  login: string; // username
  first_name: string;
  last_name: string;
  usual_full_name: string | null;
  displayname: string;
  image: {
    link: string | null;
    versions: {
      large: string | null;
      medium: string | null;
      small: string | null;
      micro: string | null;
    }
  };
  // ... other fields
}

export async function handle42Callback(code: string): Promise<{ success: boolean; user?: CustomUser; error?: string }> {
  const clientId = process.env.NEXT_PUBLIC_FORTYTWO_CLIENT_ID;
  const clientSecret = process.env.FORTYTWO_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_FORTYTWO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('42 OAuth environment variables are not set.');
    return { success: false, error: 'Server configuration error for 42 OAuth.' };
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || (tokenData as FortyTwoErrorResponse).error) {
      console.error('42 Token Exchange Error:', tokenData);
      return { success: false, error: (tokenData as FortyTwoErrorResponse).error_description || 'Failed to obtain access token from 42.' };
    }

    const { access_token } = tokenData as FortyTwoTokenResponse;

    // 2. Fetch user information from 42 API
    const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok || (userData as FortyTwoErrorResponse).error) {
      console.error('42 User Fetch Error:', userData);
      return { success: false, error: (userData as FortyTwoErrorResponse).error_description || 'Failed to fetch user information from 42.' };
    }

    const fortyTwoUser = userData as FortyTwoUser;

    // 3. Adapt 42 user data to your CustomUser format
    const appUser: CustomUser = {
      id: `42-${fortyTwoUser.id}`, // Prefix to distinguish from other auth methods
      username: fortyTwoUser.login,
      role: 'user', // Default role for 42 users
      email: fortyTwoUser.email,
      displayName: fortyTwoUser.displayname || `${fortyTwoUser.first_name} ${fortyTwoUser.last_name}`,
      photoURL: fortyTwoUser.image?.link || fortyTwoUser.image?.versions?.medium || null,
    };
    
    return { success: true, user: appUser };

  } catch (error: any) {
    console.error('Error in 42 callback handler:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during 42 authentication.' };
  }
}
