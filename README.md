# 42 Abu Dhabi Events Hub

A modern web application for managing and discovering events at 42 Abu Dhabi. Built with Next.js, Firebase, and deployed on Netlify.

## Features

- Event management and discovery
- User authentication with 42 OAuth
- Real-time updates
- Responsive design
- Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Netlify
- **Authentication**: 42 OAuth

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/imrangm/42hub.git
cd 42hub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

# 42 OAuth Configuration
NEXT_PUBLIC_FORTYTWO_CLIENT_ID=""
FORTYTWO_CLIENT_SECRET=""
NEXT_PUBLIC_APP_URL=""
NEXT_PUBLIC_FORTYTWO_REDIRECT_URI=""
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file contains the necessary build settings.

To deploy:
1. Push your changes to GitHub
2. Connect your repository to Netlify
3. Set up the environment variables in Netlify's dashboard
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
