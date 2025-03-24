
# Image Transformer App

This application uses AI to transform images based on text prompts.

## Secure API Key Setup

For security reasons, this application requires a backend server to proxy requests to the Replicate API. This prevents exposing your API key in the frontend code.

### Option 1: Setup with a Backend Framework (Node.js/Express)

1. Create a simple Express server with an endpoint that proxies requests to Replicate:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Serve static files from build directory
app.use(express.static('dist'));

// Proxy endpoint for Replicate
app.post('/api/replicate', async (req, res) => {
  const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
  
  if (!REPLICATE_API_KEY) {
    return res.status(500).json({ detail: 'API key not configured on server' });
  }

  try {
    const { model, prompt, image, ...otherParams } = req.body;
    
    // Determine which model to use
    let modelVersion;
    let requestBody;

    if (model === "interiorDesign") {
      // Interior design model
      modelVersion = "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";
      requestBody = {
        version: modelVersion,
        input: {
          image: image,
          prompt: prompt,
          ...otherParams
        },
      };
    } else {
      // Default image-to-image model
      modelVersion = "37a94e2ee35c267ee9e1e6435bd867fec5d46dbb7b3528a9f2fd3d53dc5bdc9e";
      requestBody = {
        version: modelVersion,
        input: {
          image: image,
          prompt: prompt,
        },
      };
    }

    // Create prediction
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${REPLICATE_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const prediction = await response.json();
    
    // Poll for results
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!statusResponse.ok) {
        const error = await statusResponse.json();
        return res.status(statusResponse.status).json(error);
      }
      
      const status = await statusResponse.json();
      
      if (status.status === "succeeded") {
        return res.json({
          id: status.id,
          status: status.status,
          output: status.output && status.output[0],
          error: null,
        });
      } else if (status.status === "failed") {
        return res.status(500).json({
          id: status.id,
          status: status.status,
          output: null,
          error: status.error || "Prediction failed",
        });
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    return res.status(504).json({
      id: prediction.id,
      status: "timeout",
      output: null,
      error: "Prediction timed out",
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      detail: error.message || 'Internal server error',
      status: 'error'
    });
  }
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

2. Create a `.env` file in your server directory with your API key:
```
REPLICATE_API_KEY=your_replicate_api_key_here
```

3. Install the required dependencies:
```
npm install express cors node-fetch dotenv
```

4. Start the server:
```
node server.js
```

### Option 2: Using a Serverless Function

If you're deploying to a platform like Vercel, Netlify, or AWS Lambda, you can create a serverless function:

#### For Vercel:

Create an `api` directory with a `replicate.js` file:
```javascript
// api/replicate.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
  
  if (!REPLICATE_API_KEY) {
    return res.status(500).json({ detail: 'API key not configured on server' });
  }

  try {
    const { model, prompt, image, ...otherParams } = req.body;
    
    // Similar logic as in the Express example...
    // ...

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      detail: error.message || 'Internal server error',
      status: 'error'
    });
  }
}
```

Then set the `REPLICATE_API_KEY` in your Vercel project settings.

### Option 3: Using Supabase Edge Functions

If you're using Supabase, you can create an edge function to handle the API requests securely.

## Running Locally

To develop with a proxy server:

1. Build the frontend:
```
npm run build
```

2. Start your server (which will serve the built files and handle API requests):
```
node server.js
```

3. Make sure your server has the `REPLICATE_API_KEY` environment variable set.

## Deployment

When deploying to production:

1. Set up your server or serverless function
2. Configure the environment variable `REPLICATE_API_KEY` in your hosting platform
3. Deploy both your frontend and backend code

Never expose your API key in the frontend or commit it to your repository.
