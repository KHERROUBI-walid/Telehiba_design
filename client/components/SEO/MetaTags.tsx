import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  structuredData?: object;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = "TeleHiba - Plateforme de solidarité alimentaire",
  description = "TeleHiba connecte les familles dans le besoin avec des donateurs généreux et des vendeurs locaux pour lutter contre la précarité alimentaire.",
  keywords = "solidarité, alimentaire, don, famille, vendeur, produits, aide, social, précarité, France",
  image = "/images/telehiba-og.jpg",
  url = window.location.href,
  type = "website",
  structuredData,
}) => {
  const fullTitle = title.includes("TeleHiba") ? title : `${title} | TeleHiba`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="TeleHiba" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language */}
      <html lang="fr" />
      
      {/* Open Graph (Facebook) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="TeleHiba" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Favicon and icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Preconnect to external resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
};

// Helper function to generate structured data
export const generateStructuredData = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TeleHiba",
    description: "Plateforme de solidarité alimentaire connectant familles, donateurs et vendeurs",
    url: "https://telehiba.com",
    logo: "https://telehiba.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "contact@telehiba.com",
    },
    sameAs: [
      "https://facebook.com/telehiba",
      "https://twitter.com/telehiba",
      "https://instagram.com/telehiba",
    ],
  }),

  product: (product: { nom_produit: string; description?: string; prix: number; image_url: string; vendeur: any }) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nom_produit,
    description: product.description || `${product.nom_produit} disponible sur TeleHiba`,
    image: product.image_url,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.prix,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: product.vendeur?.nom_societe || "Vendeur TeleHiba",
      },
    },
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),
};
