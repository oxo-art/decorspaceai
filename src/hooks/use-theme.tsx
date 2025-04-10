
import { useState, useEffect } from 'react';

// Remove dark/light theme functionality, make it just a simple hook with no actual theming
export const useTheme = () => {
  // This function doesn't do anything now but is kept to avoid breaking imports
  return { theme: 'light', setTheme: () => {} };
};
