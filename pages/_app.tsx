import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { supabaseAnonKey, supabaseUrl } from "@/utils/supabaseClient";

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}

export default function App({ Component, pageProps }: AppProps<{
  initialSession: Session,
}>) {
  const router = useRouter();

  const handleRouteChange = useCallback(() => {
    posthog?.capture("$pageview");
  }, []);

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [handleRouteChange]);

  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <div>
      <Head>
        <title>어캐해?</title>
        <meta name="description" content="어캐해?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="어캐해?" />
        <meta property="og:description" content="어캐해?" />
        <meta
          property="og:image"
          content="https://eokaehae.vercel.app/images/meta.png"
        />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="400" />
        <meta property="og:url" content="https://eokaehae.vercel.app/" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="어캐해?" />
        <meta property="twitter:url" content="https://eokaehae.vercel.app/" />
        <meta property="twitter:description" content="어캐해?" />
        <meta
          property="twitter:image"
          content="https://eokaehae.vercel.app/images/meta.png"
        />
      </Head>
      <div className="font-suite">
        <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
          <PostHogProvider client={posthog}>
            <RecoilRoot>
              <Component {...pageProps} />
            </RecoilRoot>
          </PostHogProvider>
        </SessionContextProvider>
      </div>
    </div>
  );
}