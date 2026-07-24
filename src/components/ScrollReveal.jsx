import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'pop',
  duration = 700
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -40px 0px' 
      }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const getInitialTransform = () => {
    switch (direction) {
      case 'down': return 'translateY(-30px) scale(0.96)';
      case 'left': return 'translateX(35px)';
      case 'right': return 'translateX(-35px)';
      case 'pop': return 'translateY(40px) scale(0.90)';
      case 'up': default: return 'translateY(40px) scale(0.96)';
    }
  };

  const animStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) translateX(0) scale(1)' : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform'
  };

  return (
    <div ref={ref} style={animStyle} className={className}>
      {children}
    </div>
  );
}