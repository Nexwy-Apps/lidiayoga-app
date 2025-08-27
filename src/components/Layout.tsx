import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}