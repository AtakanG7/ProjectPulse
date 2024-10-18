import { SessionProvider } from "next-auth/react";
import AnimatedLayout from '../pages/components/Main/AnimatedLayout';
import '../styles/global.css';
import dbConnect from "../utils/dbConnect";

/**
 * Custom App component for Next.js that wraps each page with a session provider
 * and an animated layout. This component is used to initialize pages and 
 * provide shared components or context across pages.
 *
 * @param {Object} props - The component props.
 * @param {React.ComponentType} props.Component - The active page component to render.
 * @param {Object} props.pageProps - The initial properties that were preloaded for the page.
 * @param {Object} props.pageProps.session - Session data for authentication.
 * @returns {JSX.Element} The rendered component wrapped with session and layout providers.
 */
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AnimatedLayout>
        <Component {...pageProps} />
      </AnimatedLayout>
    </SessionProvider>
  );
}

export default MyApp;