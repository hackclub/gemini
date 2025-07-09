import React from 'react';

interface BannerProps {
  text?: string;
  link?: string;
  bgColor?: string;
  textColor?: string;
}

export default function Banner({
  text = "🤖 Gemini Android Competition in progress! Check the Slack announcement for details →",
  link = "https://android.slack.com/archives/C0266FRGT/p1742577843129429",
  bgColor = "bg-primary",
  textColor = "text-gemini-black"
}: BannerProps) {
  return (
    <div className={`w-full ${bgColor} py-3 text-center sticky top-0 z-50`}>
      <a
        href={link}
        className={`${textColor} font-bold hover:underline`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    </div>
  );
} 