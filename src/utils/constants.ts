// App constants and configuration
export const APP_CONFIG = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DEFAULT_GENERATION_SETTINGS: {
    guidance_scale: 15,
    prompt_strength: 1,
    num_inference_steps: 100
  }
};

export const ERROR_MESSAGES = {
  IMAGE_TOO_LARGE: 'Image size should be less than 10MB',
  INVALID_IMAGE_TYPE: 'Please upload a valid image file (JPEG, PNG, or WebP)',
  UPLOAD_FAILED: 'Failed to upload image. Please try again.',
  GENERATION_FAILED: 'Failed to generate design. Please try again.',
  DOWNLOAD_FAILED: 'Failed to download image. Try right-clicking and Save Image As instead.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.'
};

export const SUCCESS_MESSAGES = {
  IMAGE_UPLOADED: 'Image uploaded successfully',
  GENERATION_COMPLETE: 'Interior design transformation completed successfully!',
  DOWNLOAD_STARTED: 'Download started'
};

export const ARIA_LABELS = {
  UPLOAD_AREA: 'Upload room image by clicking or dragging and dropping',
  UPLOADED_IMAGE: 'Uploaded room for interior design transformation',
  GENERATED_IMAGE: 'AI-generated interior design transformation',
  PREVIEW_IMAGE: 'Full-size preview of AI-generated interior design',
  PROMPT_INPUT: 'Enter design prompt',
  GENERATE_BUTTON: 'Generate interior design',
  DOWNLOAD_BUTTON: 'Download generated image',
  PREVIEW_BUTTON: 'Preview generated image in full size'
};