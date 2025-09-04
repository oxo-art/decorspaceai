
# AI Interior Design App

This application uses AI to generate interior design transformations based on text prompts.

## Features

- Upload room images
- Generate AI-powered interior design suggestions
- Transform images using OpenAI DALL-E
- Interactive before/after image comparison
- Responsive design for all devices

## Technology Stack

- React + TypeScript
- Tailwind CSS
- Supabase (Backend & Database)
- OpenAI DALL-E API
- Vite (Build Tool)

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Configure environment variables
   - Set up OpenAI API key in Supabase secrets

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Make sure to configure the following in your Supabase project:

- `OPENAI_API_KEY` - Your OpenAI API key for image generation

## Deployment

The app can be deployed using any modern hosting platform that supports React applications. Supabase Edge Functions handle the backend API calls securely.
