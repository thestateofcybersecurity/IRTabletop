import '../styles/globals.css'  // Adjust the path if your global.css is located elsewhere
import dynamic from 'next/dynamic';
import { AppProvider } from '../contexts/AppContext';

const DynamicTabletopGuide = dynamic(() => import('../components/TabletopGuide'), {
  loading: () => <p>Loading...</p>,
});

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </AppProvider>
  );
}

export default MyApp
