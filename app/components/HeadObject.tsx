import Head from 'next/head';
import React, { ReactNode } from 'react';

interface HeadObjectProps {
  children?: ReactNode;
}

export default function HeadObject({ children }: HeadObjectProps) {
  const title = "Gemini - Android";
  const description = "Design, Code, and Ship an Android app to the Play Store in 30 days with Gemini. Get a $100 grant for a Google Play Developer account!";
  const image = "/logo.svg";
  const url = "https://gemini.android.com";

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{title}</title>
      {/* Primary Meta Tags */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content="gemini, android, app, google play, developer, coding, programming, high school, students, hackathon" />
      <meta name="author" content="Gemini" />
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:creator" content="@hackclub" />
      <meta name="twitter:site" content="@hackclub" />
      {/* Favicons */}
      <link rel="icon" href="https://assets.hackclub.com/icon-rounded.svg" />
      <link rel="apple-touch-icon" href="https://assets.hackclub.com/icon-rounded.svg" />
      {/* iOS App Banner */}
      <meta name="apple-itunes-app" content="app-argument=https://cider.hackclub.com" />
      {/* Theme Color */}
      <meta name="theme-color" content="#3DDC84" />
      {children}
    </Head>
  );
} 