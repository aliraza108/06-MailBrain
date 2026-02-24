import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Calendar, FileText, Slack, Users } from "lucide-react";
import { useRef } from "react";

const integrations = [
  { icon: Mail, name: "Gmail", color: "text-red-500" },
  { icon: Mail, name: "Outlook", color: "text-blue-500" },
  { icon: Slack, name: "Slack", color: "text-purple-500" },
  { icon: Calendar, name: "Calendar", color: "text-green-500" },
  { icon: FileText, name: "Notion", color: "text-gray-400" },
  { icon: Users, name: "Teams", color: "text-blue-400" },
];

const Integrations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const gradientOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const gradientY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section 
      ref={containerRef}
      id="integrations" 
      className="py-24 bg-secondary/30 relative overflow-hidden"
    >
      {/* Parallax decorative gradient */}
      <motion.div 
        style={{ opacity: gradientOpacity, y: gradientY }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" 
      />

      {/* Floating orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -left-20 top-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Works With Your Favorite Tools
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Seamlessly integrates with the apps you already use every day
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto"
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 card-hover cursor-pointer group"
            >
              <motion.div 
                className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center"
                whileHover={{ rotate: 10 }}
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.15,
                }}
              >
                <integration.icon className={`w-6 h-6 ${integration.color}`} />
              </motion.div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {integration.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Integrations;
