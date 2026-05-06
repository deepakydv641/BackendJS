import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[var(--surface-1)]">
      {/* Sidebar - fixed on the left for authenticated users */}
      {user && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${user ? 'md:ml-64' : ''}`}>
        {/* Top Header - Navbar now acts as just the top header */}
        <Navbar />

        {/* Scrollable page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
