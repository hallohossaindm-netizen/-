import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React component error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF9F5] text-center font-bangla">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">পেজটি প্রদর্শনে সাময়িক সমস্যা হয়েছে</h2>
          <p className="text-stone-600 text-sm max-w-md mb-6 leading-relaxed">
            ডিভাইসের ব্রাউজার ক্যাশ বা মেমরির কারণে পেজটি আটকে থাকতে পারে। নিচের বোতামে চাপ দিয়ে পুনরায় লোড করুন।
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#064E3B] text-white rounded-xl font-semibold shadow-md hover:bg-[#043d2e] transition-colors cursor-pointer"
          >
            🔄 পৃষ্ঠাটি রিফ্রেশ করুন
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (err) {
    console.error('Failed to initialize React root:', err);
  }
}

