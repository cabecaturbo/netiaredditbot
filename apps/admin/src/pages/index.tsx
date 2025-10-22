import { useState } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import KeywordManager from '../components/KeywordManager';
import VoiceSettings from '../components/VoiceSettings';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'keywords':
        return <KeywordManager />;
      case 'voice':
        return <VoiceSettings />;
      case 'activities':
        return (
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Activities</h1>
            <p className="text-gray-600">Activity monitoring will be available here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
            <p className="text-gray-600">Bot settings will be available here.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

