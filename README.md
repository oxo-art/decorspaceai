
# AI Interior Design App

This application provides a foundation for AI-powered interior design transformations.

## Features

- Upload room images
- Text prompt input for design specifications  
- Interactive before/after image comparison
- Responsive design for all devices
- Clean architecture ready for AI model integration

## Technology Stack

- React + TypeScript
- Tailwind CSS
- Supabase (Backend & Database)
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

4. Start the development server:
```bash
npm run dev
```

## AI Model Integration

The codebase is prepared for AI model integration. You can add your preferred AI model by:

1. Creating a service file in `src/services/` 
2. Implementing the required functions:
   - `generateImage()` for image transformation
   - `getAIDesignSuggestion()` for prompt suggestions
3. Adding backend functions in `supabase/functions/` if needed
4. Updating the imports in the components

## Deployment

The app can be deployed using any modern hosting platform that supports React applications.
