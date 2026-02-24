import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Reply, BarChart3, Shield } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Zap,
    title: "Instant Drafts",
    description:
      "Generate professional email drafts in seconds with AI-powered writing assistance.",
  },
  {
    icon: Reply,
    title: "Smart Replies",
    description:
      "Context-aware responses that understand conversation history and tone.",
  },
  {
    icon: BarChart3,
    title: "AI Insights",
    description:
      "Get analytics on your email patterns and suggestions for better communication.",
  },
  {
    icon: Shield,
    title: "Secure Inbox",
    description:
      "Enterprise-grade security with end-to-end encryption for all your data.",
  },
];

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const backgroundX2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Parallax floating orbs */}
      <motion.div
        style={{ x: backgroundX }}
        className="absolute -left-32 top-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"
      />
      <motion.div
        style={{ x: backgroundX2 }}
        className="absolute -right-32 top-1/3 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none"
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
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to supercharge your email productivity
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-6 rounded-2xl card-hover cursor-pointer group"
            >
              <motion.div 
                className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  animate={{ 
                    y: [0, -3, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors"
              >
                {feature.title}
              </motion.h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
