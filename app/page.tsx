'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import Balancer from 'react-wrap-balancer';
import Footer from './components/Footer';
import { steps } from './data/steps';
import { requirements } from './data/requirements';
import { faqs } from './data/faqs';
import Question from './components/Question';
import { SubmissionCard, Submission } from './components/SubmissionCard';
import HeadObject from './components/HeadObject';
import MetaData from './components/MetaData';

// const mockSubmissions: Submission[] = [
//   {
//     id: '1',
//     name: 'Sample App',
//     description: 'A cool app built for the demo.',
//     images: [{ url: '/banner.png' }],
//     location: {
//       city: 'San Francisco',
//       country: 'USA',
//       coordinates: {
//         latitude: 37.7749,
//         longitude: -122.4194,
//       },
//     },
//   },
// ];

export default function Home() {
  const { handleSubmit, control, formState: { isSubmitting } } = useForm();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/submission');
        if (response.ok) {
          const data = await response.json();
          // Show only the first 3 submissions on the home page
          setSubmissions(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, []);

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      console.log('Submitting data:', data);
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      setSubmissionStatus('success');
    } catch {
      setSubmissionStatus('error');
    }
  };

  return (
    <main className="flex flex-col items-center">
      <HeadObject />
      <MetaData />
      {/* <Banner /> */}
      <a href="https://hackclub.com">
        <Image
          src="/flag.png"
          alt="Hack Club Flag"
          className="absolute top-0 left-4 w-1/4 lg:w-1/12 hover:transform hover:-rotate-12 hover:duration-300 hover:ease-in-out z-40"
          width={120}
          height={120}
        />
      </a>
      <div className="w-full h-full flex flex-col items-center header-gradient min-h-screen pt-16">
        <section className="flex flex-col items-center justify-center min-h-[70vh] gap-6 w-10/12 lg:w-1/2 text-white">
          <img src="/logo.png" alt="Gemini Android Logo" className="w-80 md:w-96 mb-4" width={384} height={144} />
          <h2 className="text-4xl md:text-5xl text-center text-white font-bold">
            <Balancer ratio={0.2}>
              Ship an Android app to the Play Store, get an Android Phone
            </Balancer>
          </h2>
          <p className="text-lg md:text-xl text-center opacity-90 max-w-2xl">
            Get a $25 grant for your Google Play Developer account and a $100 phone to test your app.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <a
              href="https://forms.hackclub.com/t/3KUTJRwTFous"
              target="_blank"
              className="btn backdrop-blur-sm text-white border-2 border-white px-6 py-3 font-bold text-lg rounded-lg hover:bg-white/20 transition-all"
              rel="noopener noreferrer"
            >
              Pitch your idea
            </a>
            <a
              href="https://submit.hackclub.com/gemini"
              target="_blank"
              className="btn bg-white backdrop-blur-sm text-green-700 border-2 border-white px-6 py-3 font-bold text-lg rounded-lg hover:bg-white/20 transition-all"
              rel="noopener noreferrer"
            >
              Submit&nbsp;your&nbsp;app
            </a>
          </div>
        </section>
        <div className="w-10/12 sm:w-auto max-w-xl mb-16 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/30 shadow-xl">
          <h3 className="text-white text-xl font-bold mb-4">Get your $25 grant and a free Android Phone!</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      required
                      type="email"
                      className="text-white placeholder:text-white/70 text-lg w-full rounded-lg border-2 border-white/40 focus:border-white bg-white/5 py-3 pl-10 pr-4 focus:outline-none data-[focus]:outline-2 transition"
                      placeholder="mohamad@hackclub.com"
                      {...field}
                    />
                  </div>
                  {fieldState.error && (
                    <p className="text-white/80 text-sm">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-red px-6 py-3 font-bold text-lg rounded-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Sign up for the grant'}
            </button>
            {submissionStatus === 'success' && <p className="text-green-400">Thank you for signing up!</p>}
            {submissionStatus === 'error' && <p className="text-red-400">There was an error. Please try again.</p>}
          </form>
        </div>
      </div>
      <section id="prompt" className="section-padding flex flex-col justify-center gap-8 w-11/12 max-w-6xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl mb-4">How It Works</h2>
          <p className="text-xl text-hack-muted max-w-3xl mx-auto">
            <Balancer>
              Build an app that improves an aspect of your (and your friends&apos;) lives
            </Balancer>
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map(({ heading, description, link, primary }, index) => (
            <div
              key={index}
              className={`card flex flex-col justify-between gap-4 p-6 ${primary ? 'border-2 border-red md:transform md:scale-105' : ''}`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-hack-muted mb-1">STEP {index + 1}</span>
                <h3 className="text-xl font-bold text-hack-black mb-2">{heading}</h3>
                <p className="text-hack-muted">{description}</p>
              </div>
              {link && (
                <a
                  href={link}
                  className="text-red font-bold flex items-center gap-1 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Submit
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline">
                    <path d="M15.0378 6.34317L13.6269 7.76069L16.8972 11.0157L3.29211 11.0293L3.29413 13.0293L16.8619 13.0157L13.6467 16.2459L15.0643 17.6568L20.7079 11.9868L15.0378 6.34317Z" fill="currentColor" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="section-padding bg-white w-full">
        <div className="max-w-6xl mx-auto w-11/12">
          <h2 className="text-4xl md:text-5xl mb-8 text-center">Project Requirements</h2>
          <div className="bg-hack-smoke p-8 rounded-xl">
            <ul className="grid md:grid-cols-2 gap-4">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 text-red">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-hack-black">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section-padding flex flex-col items-center gap-12 justify-center w-11/12 max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl mb-4">Community Projects!</h2>
          <p className="text-xl text-hack-muted max-w-3xl mx-auto">
            Check out what others in the community have built!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {/* {mockSubmissions.map((submission, index) => (
            <SubmissionCard key={index} submission={submission} />
          ))} */}
          {isLoadingSubmissions ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-red border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-hack-muted">Loading submissions...</p>
            </div>
          ) : submissions.length > 0 ? (
            submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-hack-muted">No submissions yet. Be the first to submit!</p>
            </div>
          )}
        </div>
        <a
          href="/submissions"
          className="btn btn-outline text-lg font-bold px-6 py-3 rounded-lg"
        >
          View all submissions
        </a>
      </section>
      <section className="section-padding bg-gray-50 w-full">
        <div className="max-w-6xl mx-auto w-11/12">
          <h2 className="text-4xl md:text-5xl mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map(({ question, answer }, index) => (
              <Question key={index} heading={question} description={answer} />
            ))}
          </div>
        </div>
      </section>
      <section className="my-16 flex flex-col items-center justify-center gap-8 w-11/12 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl">
          <Balancer>
            Ready to build your Android app?
          </Balancer>
        </h2>
        <p className="text-xl text-hack-muted max-w-3xl">
          Join our community, get $25 for your Google Play Developer account!
        </p>
        <div className="w-full max-w-xl mt-4 bg-hack-smoke p-8 rounded-xl shadow-md border border-gray-100">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <label htmlFor="email-signup" className="block text-left text-hack-black font-bold mb-2">Your Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hack-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email-signup"
                      required
                      type="email"
                      className="text-hack-black placeholder:text-hack-muted/60 text-lg w-full rounded-lg border-2 border-gray-200 focus:border-red bg-white py-3 pl-10 pr-4 focus:outline-none shadow-sm"
                      placeholder="mohamad@hackclub.com"
                      {...field}
                    />
                  </div>
                  {fieldState.error && (
                    <p className="text-red text-sm text-left">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary text-lg font-bold py-3 px-6 mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Sign up for the grant'}
            </button>
            {submissionStatus === 'success' && <p className="text-green-400">Thank you for signing up!</p>}
            {submissionStatus === 'error' && <p className="text-red-400">There was an error. Please try again.</p>}
          </form>
        </div>
        <div className="mt-16 text-center">
          <a
            target="_blank"
            href="https://hackclub.com/slack?event=%23gemini"
            className="btn btn-primary text-lg font-bold px-8 py-3 uppercase"
            rel="noopener noreferrer"
          >
            Join us on Slack
          </a>
          <p className="text-hack-muted mt-4">
            Already have an account? Join the{' '}
            <a
              href="https://hackclub.slack.com/archives/C094VQKH1FV"
              className="text-red font-medium underline"
              rel="noopener noreferrer"
            >
              #gemini
            </a>{' '}
            channel!
          </p>
        </div>
      </section>
      <Footer />

    </main>
  );
}
