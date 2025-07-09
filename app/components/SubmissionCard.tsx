import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface Submission {
  id: string;
  name: string;
  description: string;
  githubUsername?: string;
  slackId?: string;
  githubUrl?: string;
  playableUrl?: string;
  images: { url: string }[];
  location: {
    city?: string;
    country?: string;
    coordinates?: { latitude: number; longitude: number };
  };
}

interface SubmissionCardProps {
  submission: Submission;
  onClick?: () => void;
}

export function SubmissionCard({ submission, onClick }: SubmissionCardProps) {
  return (
    <motion.div
      className="card overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={submission?.images?.[0]?.url || 'https://assets.hackclub.com/icon-rounded.png'}
          alt={submission?.name}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-1">{submission.name}</h2>
        <p className="text-hack-black mb-6 line-clamp-3 flex-grow">{submission.description}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <a
            href={submission.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline flex items-center justify-center gap-2 rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub
          </a>
          <a
            href={submission.playableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex items-center justify-center gap-2"
            onClick={e => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1-2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Install
          </a>
        </div>
      </div>
    </motion.div>
  );
} 