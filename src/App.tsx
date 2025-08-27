import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Meditations from './pages/Meditations';
import Workshops from './pages/Workshops';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import VideoPlayer from './pages/VideoPlayer';
import AdminPanel from './pages/AdminPanel';
import Checkout from './pages/Checkout';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="classes" element={<Classes />} />
              <Route path="meditations" element={<Meditations />} />
              <Route path="workshops" element={<Workshops />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
            <Route path="/watch/:contentId" element={<VideoPlayer />} />
          </Routes>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;