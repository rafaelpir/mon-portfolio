"use client";
import React, { useRef, useEffect } from "react";

export const SparklesCore = (props) => {
  const {
    background = "transparent",
    minSize = 1,
    maxSize = 3,
    particleDensity = 100,
    className = "",
    particleColor = "#FFFFFF",
    speed = 1,
  } = props;

  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Recreate particles on resize
      createParticles();
    };

    // Create particles
    const createParticles = () => {
      const particleArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000 * (particleDensity / 100));

      for (let i = 0; i < numberOfParticles; i++) {
        particleArray.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          opacity: Math.random() * 0.5 + 0.5,
          fadeDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }
      particlesRef.current = particleArray;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Update opacity (twinkling effect)
        particle.opacity += particle.fadeDirection * 0.01;
        if (particle.opacity >= 1 || particle.opacity <= 0.3) {
          particle.fadeDirection *= -1;
        }

        // Draw particle
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [background, minSize, maxSize, particleDensity, particleColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        background: background,
      }}
    />
  );
};
