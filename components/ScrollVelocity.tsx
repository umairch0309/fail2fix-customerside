"use client";
import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react";
import "./ScrollVelocity.css";
import Scrollicon from "@/public/icons/scrollicon";

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface MarqueeTextItem {
  text: string;
  href: string;
}

interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: MarqueeTextItem[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
  showIcons?: boolean;
  alternateColors?: boolean;
  direction?: "horizontal" | "vertical";
  gap?: number | string;
}

function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

function useElementHeight<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): number {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    function updateHeight() {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [ref]);

  return height;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
  showIcons = true,
  alternateColors = true,
  direction = "horizontal",
}) => {
  const isVertical = direction === "vertical";
  function VelocityText({
    children,
    baseVelocity = velocity,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
  }: VelocityTextProps) {
    const basePosition = useMotionValue(0);
    const scrollOptions = scrollContainerRef
      ? { container: scrollContainerRef }
      : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: damping ?? 50,
      stiffness: stiffness ?? 400,
    });
    const velocityFactor = useTransform(
      smoothVelocity,
      velocityMapping?.input || [0, 1000],
      velocityMapping?.output || [0, 5],
      { clamp: false }
    );

    const copyRef = useRef<HTMLSpanElement>(null);
    const copyWidth = useElementWidth(copyRef);
    const copyHeight = useElementHeight(copyRef);
    const copySize = isVertical ? copyHeight : copyWidth;

    function wrap(min: number, max: number, v: number): number {
      const range = max - min;
      const mod = (((v - min) % range) + range) % range;
      return mod + min;
    }

    const transformValue = useTransform(basePosition, (v) => {
      if (copySize === 0) return "0px";
      return `${wrap(-copySize, 0, v)}px`;
    });

    const directionFactor = useRef<number>(1);
    useAnimationFrame((_, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      basePosition.set(basePosition.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < numCopies!; i++) {
      spans.push(
        <span
          className={className}
          key={i}
          ref={i === 0 ? copyRef : null}
          style={{ color: alternateColors && i % 2 === 1 ? "#6F6F6F" : "inherit" }}
        >
          {children}
        </span>
      );
    }

    const verticalScrollerStyle: React.CSSProperties = isVertical
      ? { flexDirection: "column", whiteSpace: "normal" }
      : {};

    return (
      <div className={parallaxClassName} style={{ overflow: "hidden", position: "relative", ...parallaxStyle }}>
        <motion.div
          className={scrollerClassName}
          style={{
            ...(isVertical ? { y: transformValue } : { x: transformValue }),
            ...verticalScrollerStyle,
            ...scrollerStyle,
          }}
        >
          {spans}
        </motion.div>
      </div>
    );
  }

  // Render texts as links with scroll icon between each
  const renderMarquee = () =>
    texts.map((item, idx) => {
      const isAlternate = idx % 2 === 1;
      const textColor = alternateColors && isAlternate ? "#6F6F6F" : "inherit";
      return (
        <React.Fragment key={idx}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: textColor }}
          >
            {item.text}
          </a>
          {showIcons && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                margin: "0 24px",
              }}
            >
              <Scrollicon size={28} />
            </span>
          )}
          {!showIcons && <span style={{ margin: "0 24px" }} />}
        </React.Fragment>
      );
    });
  return (
    <section>
      <VelocityText
        className={className}
        baseVelocity={velocity}
        scrollContainerRef={scrollContainerRef}
        damping={damping}
        stiffness={stiffness}
        numCopies={numCopies}
        velocityMapping={velocityMapping}
        parallaxClassName={parallaxClassName}
        scrollerClassName={scrollerClassName}
        parallaxStyle={parallaxStyle}
        scrollerStyle={scrollerStyle}
      >
        {renderMarquee()}
      </VelocityText>
    </section>
  );
};

export default ScrollVelocity;
