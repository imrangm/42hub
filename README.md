# 42 Abu Dhabi Events Hub

A modern web application for managing and discovering events at 42 Abu Dhabi. Built with Next.js and deployed on Netlify.

## Features

- Event management and discovery
- User authentication with 42 OAuth
- Real-time updates
- Responsive design
- Modern UI with Tailwind CSS
- AI-powered event descriptions and promotional content

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Netlify Functions
- **Authentication**: Netlify Identity + 42 OAuth
- **Deployment**: Netlify
- **AI**: Anthropic Claude API

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
# Netlify Configuration
NEXT_PUBLIC_NETLIFY_SITE_URL="https://your-netlify-app-name.netlify.app"
NEXT_PUBLIC_NETLIFY_IDENTITY_URL="https://your-netlify-app-name.netlify.app/.netlify/identity"

# 42 OAuth Configuration
NEXT_PUBLIC_FORTYTWO_CLIENT_ID=""
FORTYTWO_CLIENT_SECRET=""
NEXT_PUBLIC_APP_URL=""
NEXT_PUBLIC_FORTYTWO_REDIRECT_URI=""

# Anthropic Claude API Configuration
ANTHROPIC_API_KEY=""
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
3. Enable Netlify Identity in your site settings
4. Set up the environment variables in Netlify's dashboard
5. Deploy!

## Netlify Setup

1. **Enable Netlify Identity**:
   - Go to Site settings > Identity
   - Click "Enable Identity"
   - Configure your registration preferences

2. **Configure 42 OAuth**:
   - Go to Site settings > Identity > Services
   - Add 42 OAuth provider
   - Use the same credentials from your 42 OAuth application

3. **Environment Variables**:
   - Set up all required environment variables in Site settings > Environment variables
   - Make sure to include all variables listed in the `.env` section above
   - For the Anthropic API key, you can get it from https://console.anthropic.com/

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
