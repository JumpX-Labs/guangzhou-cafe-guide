import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'
import Home from './pages/Home.tsx'
import Explore from './pages/Explore.tsx'
import CafeDetail from './pages/CafeDetail.tsx'

import Admin from './pages/Admin.tsx'
import ApiDocs from './pages/ApiDocs.tsx'
import Assignment from './pages/Assignment.tsx'
import Deployment from './pages/Deployment.tsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-body">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/cafe/:slug" element={<CafeDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/deployment" element={<Deployment />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
