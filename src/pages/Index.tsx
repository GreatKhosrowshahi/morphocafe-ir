import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import FeaturedProduct from "@/components/FeaturedProduct";
import MenuSection from "@/components/MenuSection";
import MoodSelector from "@/components/MoodSelector";
import Footer from "@/components/Footer";
import { WelcomeGate } from "@/components/WelcomeGate";
import { useCart } from "@/features/cart/context/CartContext";
import { ShoppingBag } from "lucide-react";
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
        {showWelcome && <WelcomeGate onEnter={handleEnter} />}
      </AnimatePresence>

      <div
        className={`min-h-screen transition-opacity duration-1000 ${showWelcome ? 'opacity-0' : 'opacity-100'}`}
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

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-morho-gold text-morho-deep p-4 rounded-full shadow-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <ShoppingBag className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-morho-deep">
              {itemCount}
            </span>
          )}
        </button>

      </div>
    </>
  );
};

export default Index;
