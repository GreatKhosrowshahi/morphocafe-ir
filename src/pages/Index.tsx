import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import FeaturedProduct from "@/components/FeaturedProduct";
import MenuSection from "@/components/MenuSection";
import MoodSelector from "@/components/MoodSelector";
import Footer from "@/components/Footer";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import FAQ from "@/components/FAQ";

const Index = () => {
  const { itemCount, setIsCartOpen } = useCart();
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
          <FAQ />
        </main>
        <Footer />
        <CartSidebar />

        {/* Floating Cart Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-morho-gold text-morho-deep p-4 rounded-full shadow-glow flex items-center justify-center"
        >
          <ShoppingBag className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-morho-deep">
              {itemCount}
            </span>
          )}
        </motion.button>

      </motion.div>
    </>
  );
};

export default Index;
