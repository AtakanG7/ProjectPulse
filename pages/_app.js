import { SessionProvider } from "next-auth/react";
import AnimatedLayout from '../pages/components/Main/AnimatedLayout';
import '../styles/global.css';
import dbConnect from "../utils/dbConnect";
import Project from "../models/Project";
import User from "../models/User";

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