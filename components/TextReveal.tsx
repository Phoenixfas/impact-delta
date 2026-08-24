'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TextRevealProps {
  /** Array of lines (strings or React nodes) to reveal. If omitted, `children` will be used. */
  lines?: React.ReactNode[];
  /** React children representing text/lines if `lines` prop is omitted. */
  children?: React.ReactNode;
  /** Custom background color for the overlay bar. Defaults to `#00a7f5`. */
  overlayColor?: string;
  /** Direction the overlay slides off. Defaults to `'left-to-right'`. */
  direction?: 'left-to-right' | 'right-to-left';
  /** Classes applied to the outer wrapper container. */
  className?: string;
  /** Classes applied to each line item container. */
  lineClassName?: string;
  /** Custom classes for the overlay element. */
  overlayClassName?: string;
  /** Tag name for the wrapper element. Defaults to `'div'`. */
  as?: React.ElementType;
  /** Tag name for each line item element. Defaults to `'div'`. */
  lineAs?: React.ElementType;
  /** Duration of overlay slide animation for each line in seconds. Defaults to `0.85`. */
  duration?: number;
  /** Stagger delay between consecutive lines in seconds. Defaults to `0.18`. */
  stagger?: number;
  /** GSAP easing curve string. Defaults to `'power3.inOut'`. */
  ease?: string;
  /** Delay before animation starts in seconds. Defaults to `0`. */
  delay?: number;
  /** ScrollTrigger start position. Defaults to `'top 85%'`. */
  triggerStart?: string;
  /** ScrollTrigger toggleActions string. Defaults to `'play none none none'`. */
  toggleActions?: string;
  /** Whether the animation should only play once. Defaults to `true`. */
  once?: boolean;
}

export default function TextReveal({
  lines,
  children,
  overlayColor = '#00a7f5',
  direction = 'left-to-right',
  className = '',
  lineClassName = '',
  overlayClassName = '',
  as: ComponentProp = 'div',
  lineAs: LineComponentProp = 'div',
  duration = 0.85,
  stagger = 0.18,
  ease = 'power3.inOut',
  delay = 0,
  triggerStart = 'top 85%',
  toggleActions = 'play none none none',
  once = true,
}: TextRevealProps) {
  const Component = ComponentProp as React.ComponentType<any>;
  const LineComponent = LineComponentProp as React.ComponentType<any>;
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const hasTriggeredRef = useRef(false);

  // Extract lines from `lines` prop or `children`
  let lineItems: React.ReactNode[] = [];

  if (lines && lines.length > 0) {
    lineItems = lines;
  } else if (children) {
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length === 1 && typeof childrenArray[0] === 'string') {
      const str = childrenArray[0] as string;
      lineItems = str.includes('\n') ? str.split('\n').filter(Boolean) : [str];
    } else {
      lineItems = childrenArray;
    }
  }

  useEffect(() => {
    if (!containerRef.current || lineItems.length === 0) return;

    const ctx = gsap.context(() => {
      const lineElements = linesRef.current.filter(Boolean) as HTMLDivElement[];
      if (lineElements.length === 0) return;

      const overlays = lineElements
        .map((line) => line.querySelector('.line-reveal-overlay'))
        .filter(Boolean);

      const targetXPercent = direction === 'left-to-right' ? 105 : -105;

      if (hasTriggeredRef.current && once) {
        gsap.set(lineElements, { autoAlpha: 1 });
        if (overlays.length > 0) gsap.set(overlays, { xPercent: targetXPercent });
        return;
      }

      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          toggleActions: once ? 'play none none none' : toggleActions,
          once,
          onEnter: () => {
            hasTriggeredRef.current = true;
          },
        },
      });

      lineElements.forEach((el, idx) => {
        const overlay = el.querySelector('.line-reveal-overlay');
        if (!overlay) return;

        const startTime = idx * stagger;

        tl.set(el, { autoAlpha: 1 }, startTime).to(
          overlay,
          {
            xPercent: targetXPercent,
            duration,
            ease,
          },
          startTime
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [lineItems.length, duration, ease, stagger, delay, triggerStart, toggleActions, once, direction]);

  const completedTransform = direction === 'left-to-right' ? 'translateX(105%)' : 'translateX(-105%)';

  return (
    <Component ref={containerRef} className={className}>
      {lineItems.map((item, index) => (
        <LineComponent
          key={index}
          ref={(el: HTMLDivElement | null) => {
            linesRef.current[index] = el;
          }}
          className={`line-reveal-item relative overflow-hidden py-0.5 px-1 max-w-full inline-block ${lineClassName}`}
          style={{
            opacity: hasTriggeredRef.current && once ? 1 : 0,
          }}
        >
          {item}
          <div
            className={`line-reveal-overlay absolute inset-0 z-10 pointer-events-none ${overlayClassName}`}
            style={{
              backgroundColor: overlayColor,
              transform: hasTriggeredRef.current && once ? completedTransform : undefined,
            }}
          />
        </LineComponent>
      ))}
    </Component>
  );
}
