import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "per month",
    description: "Perfect for individuals getting started",
    features: [
      "Up to 500 emails/month",
      "Basic AI drafts",
      "Gmail integration",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "per month",
    description: "For professionals who need more power",
    features: [
      "Unlimited emails",
      "Advanced AI features",
      "All integrations",
      "Priority support",
      "Custom templates",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and organizations",
    features: [
      "Everything in Professional",
      "Team management",
      "SSO & SAML",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section ref={containerRef} id="pricing" className="py-24 relative overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </motion.div>

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
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`glass-card p-8 rounded-2xl relative card-hover ${
                plan.popular
                  ? "border-2 border-primary shadow-2xl shadow-primary/20"
                  : ""
              }`}
            >
              {plan.popular && (
                <motion.div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  animate={{ 
                    boxShadow: [
                      "0 0 10px hsl(45 100% 62% / 0.3)",
                      "0 0 20px hsl(45 100% 62% / 0.5)",
                      "0 0 10px hsl(45 100% 62% / 0.3)"
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  Most Popular
                </motion.div>
              )}

              <div className="text-center mb-8">
                <motion.h3 
                  className="text-2xl font-bold mb-2"
                  whileHover={{ color: "hsl(45 100% 62%)" }}
                >
                  {plan.name}
                </motion.h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <motion.div 
                  className="mb-2"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground ml-2">
                      /{plan.period}
                    </span>
                  )}
                </motion.div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <motion.div 
                      className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5"
                      whileHover={{ scale: 1.2, backgroundColor: "hsl(45 100% 62% / 0.4)" }}
                    >
                      <Check className="w-3 h-3 text-primary" />
                    </motion.div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover-glow"
                      : "hover-glow"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to="/login">{plan.cta}</Link>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
