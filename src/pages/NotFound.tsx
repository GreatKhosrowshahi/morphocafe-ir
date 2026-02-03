import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto w-20 h-20 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow mb-8"
        >
          <Coffee className="w-10 h-10" />
        </motion.div>
        <h1 className="mb-4 text-7xl font-bold text-gradient">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">This page seems to have evaporated...</p>
        <motion.a 
          href="/" 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-accent font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Cafe
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFound;
