import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

const SEO = ({ 
  title = "Quantum Doors - Revolucionando a Física Quântica",
  description = "Explore o futuro da propulsão intergaláctica com o projeto Quantum Doors. Pesquisa inovadora em física quântica, cristais isocovalentes e motores de dobra espacial.",
  image = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000",
  path = ""
}: SEOProps) => {
  const siteUrl = "https://quantum-doors.com"; // Replace with actual domain when deployed
  const fullUrl = `${siteUrl}${path}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional SEO */}
      <meta name="keywords" content="física quântica, propulsão intergaláctica, cristais isocovalentes, motor quântico, dobra espacial, Julio Campos Machado, pesquisa científica" />
      <meta name="author" content="Julio Campos Machado" />
      <meta name="robots" content="index, follow" />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#020617" />
    </Helmet>
  );
};

export default SEO;