import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from "@/components/BottomNav";
import { useMuseumStore } from "@/store/useMuseumStore";

import Home from "@/pages/Home";
import CollectionList from "@/pages/CollectionList";
import AddExhibit from "@/pages/AddExhibit";
import ExhibitDetail from "@/pages/ExhibitDetail";
import ExhibitionList from "@/pages/ExhibitionList";
import CreateExhibition from "@/pages/CreateExhibition";
import ExhibitionDetail from "@/pages/ExhibitionDetail";
import RouteMap from "@/pages/RouteMap";
import ChallengeHome from "@/pages/ChallengeHome";
import ChallengePlay from "@/pages/ChallengePlay";

const mainRoutes = [
  '/',
  '/collection',
  '/exhibitions',
  '/route',
  '/challenge',
];

function AppContent() {
  const location = useLocation();
  const init = useMuseumStore(state => state.init);
  
  useEffect(() => {
    init();
  }, [init]);
  
  const showNav = mainRoutes.includes(location.pathname);
  
  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<CollectionList />} />
            <Route path="/collection/add" element={<AddExhibit />} />
            <Route path="/collection/:id" element={<ExhibitDetail />} />
            <Route path="/exhibitions" element={<ExhibitionList />} />
            <Route path="/exhibitions/create" element={<CreateExhibition />} />
            <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
            <Route path="/route" element={<RouteMap />} />
            <Route path="/challenge" element={<ChallengeHome />} />
            <Route path="/challenge/play" element={<ChallengePlay />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      
      {showNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
