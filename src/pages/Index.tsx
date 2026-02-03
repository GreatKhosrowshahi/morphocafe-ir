import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import FeaturedProduct from "@/components/FeaturedProduct";
import MenuSection from "@/components/MenuSection";
import MoodSelector from "@/components/MoodSelector";
import MoodBarista from "@/components/MoodBarista";
import Footer from "@/components/Footer";
import WelcomeScreen from "@/components/WelcomeScreen";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const menuRef = useRef<HTMLElement>(null);

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const handleEnter = () => {
    setShowWelcome(false);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    scrollToMenu();
  };

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeScreen onEnter={handleEnter} />}
      </AnimatePresence>

      <motion.div
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: showWelcome ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Header />
        <main className="pt-24">
          <FeaturedProduct />
          <MoodSelector onSelectMood={handleMoodSelect} />
          <MenuSection
            sectionRef={menuRef}
            initialCategory={selectedMood}
          />
          <MoodBarista />
        </main>
        <Footer />
      </motion.div>
    </>
  );
};

export default Index;
