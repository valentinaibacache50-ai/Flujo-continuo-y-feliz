import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-primary/[0.08]",
  floatDuration = 12,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  floatDuration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 1.8,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 0.9 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-primary/[0.08]",
            "shadow-[0_8px_32px_0_hsl(var(--primary)/0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-accent/[0.05]" />

      {/* Geometric shapes — varied float speeds */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={600}
          height={140}
          rotate={12}
          gradient="from-primary/[0.08]"
          floatDuration={10}
          className="top-[-10%] left-[-5%] md:left-[0%]"
        />
        <ElegantShape
          delay={0.35}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-accent/[0.08]"
          floatDuration={14}
          className="top-[15%] right-[-10%] md:right-[-5%]"
        />
        <ElegantShape
          delay={0.3}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-primary/[0.06]"
          floatDuration={16}
          className="bottom-[5%] left-[5%] md:left-[10%]"
        />
        <ElegantShape
          delay={0.45}
          width={200}
          height={60}
          rotate={20}
          gradient="from-accent/[0.06]"
          floatDuration={9}
          className="top-[60%] right-[5%] md:right-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-primary/[0.04]"
          floatDuration={18}
          className="top-[8%] left-[45%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border mb-8"
          >
            <Circle className="h-2 w-2 fill-primary text-primary" />
            <span className="text-sm text-muted-foreground tracking-wide">
              {badge}
            </span>
          </motion.div>

          {/* Title with scale entrance */}
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
            <h1 className="font-space font-bold uppercase text-4xl sm:text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight">
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
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-8"
            >
              {description}
            </motion.p>
          )}

          {/* CTA with glow pulse */}
          {ctaText && ctaHref && (
            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="mt-8"
            >
              <motion.a
                href={ctaHref}
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors relative"
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Scroll indicator — mouse icon with animated wheel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">Deslizar</span>
        <div className="w-6 h-10 border-2 border-muted-foreground/40 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

export { HeroGeometric };
