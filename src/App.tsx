
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import IndexPage from './pages/Index';
import AboutPage from './pages/About';
import CreditsPage from './pages/Credits';
import AuthPage from './pages/Auth';
import ErrorBoundary from './components/ui/error-boundary';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design" element={<IndexPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
