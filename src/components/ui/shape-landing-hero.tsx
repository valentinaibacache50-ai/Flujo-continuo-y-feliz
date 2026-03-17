import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Circle } from "lucide-react";

function HeroGeometric({
  badge = "Design Collective",
  title1 = "Elevate Your Digital Vision",
  title2 = "Crafting Exceptional Websites",
  description,
  ctaText,
  ctaHref,
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isTouch, setIsTouch] = useState(true);
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], isTouch ? ["0%", "0%"] : ["0%", "30%"]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden bg-background"
      style={{ minHeight: "100svh" }}
    >
      {/* Hero background — covers full viewport, uses object-top so the player is visible on mobile */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-background/60 sm:bg-background/70" />
      </motion.div>

      {/* Subtle green glow — smaller on mobile for perf */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] sm:w-[700px] sm:h-[700px] rounded-full bg-primary/10 blur-[60px] sm:blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[180px] h-[180px] sm:w-[500px] sm:h-[500px] rounded-full bg-accent/10 blur-[50px] sm:blur-[120px]" />
      </div>

      {/* Content — vertically centered with safe padding for navbar */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-28 sm:pt-24 sm:pb-20 drop-shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border mb-5 sm:mb-8"
          >
            <Circle className="h-2 w-2 fill-primary text-primary" />
            <span className="text-[11px] sm:text-sm text-muted-foreground tracking-wide">
              {badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            custom={1}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 1.2,
                  delay: 0.7,
                  ease: [0.25, 0.4, 0.25, 1],
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <h1 className="font-bebas text-[3rem] leading-[0.92] sm:text-6xl md:text-8xl lg:text-[10rem] sm:leading-none tracking-wide">
              <span className="text-gradient-green">{title1}</span>
              <br />
              <span className="text-gradient-green">{title2}</span>
            </h1>
          </motion.div>

          {/* Description */}
          {description && (
            <motion.p
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-5 sm:mt-8 px-2 sm:px-0"
            >
              {description}
            </motion.p>
          )}

          {/* CTA */}
          {ctaText && ctaHref && (
            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 sm:mt-8"
            >
              <motion.a
                href={ctaHref}
                className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors relative text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 rounded-lg bg-primary/30"
                  animate={{ opacity: [0, 0.6, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="relative z-10">{ctaText}</span>
              </motion.a>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

export { HeroGeometric };
