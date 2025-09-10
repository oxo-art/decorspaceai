import React from 'react';

interface StructuredDataProps {
  type: 'WebApplication' | 'Organization' | 'Article';
}

const StructuredData: React.FC<StructuredDataProps> = ({ type }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'WebApplication':
        return {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Decorspace AI",
          "description": "Transform your living space with AI-powered interior design. Upload a room photo and get stunning design transformations instantly.",
          "url": "https://decorspaceai.com",
          "applicationCategory": "DesignApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "creator": {
            "@type": "Organization",
            "name": "Decorspace AI"
          }
        };
      
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Decorspace AI",
          "description": "AI-powered interior design platform democratizing professional design for everyone.",
          "url": "https://decorspaceai.com",
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "contact@decorspaceai.com",
            "contactType": "customer service"
          }
        };
      
      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;