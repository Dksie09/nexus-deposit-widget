"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

interface ShapeData {
  element: SVGElement;
  bounds: { x: number; y: number; width: number; height: number };
  lastPurpleTime: number;
  targetColor: string;
  currentColor: string;
}

export function InteractiveQRCode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastHoverTimeRef = useRef<number>(0);

  // Parse SVG and extract interactive elements
  useEffect(() => {
    fetch("/qr-code.svg")
      .then((res) => res.text())
      .then((svg) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, "image/svg+xml");

        const paths = doc.querySelectorAll("path");
        const extractedCircles: Array<{ x: number; y: number; r: number }> = [];
        const pathsWithCircles: Element[] = [];
        const cornerSquarePaths: Element[] = [];

        paths.forEach((path) => {
          const d = path.getAttribute("d") || "";
          const fill = path.getAttribute("fill") || "";

          if (fill.includes("url(#mainGradient)")) {
            cornerSquarePaths.push(path);
          }

          const circlePattern =
            /M([\d.]+)\s+([\d.]+)a([\d.]+)\s+([\d.]+)\s+0\s+0\s+1\s+([-\d.]+)\s+([-\d.]+)/g;

          let match;
          let hasCircles = false;
          while ((match = circlePattern.exec(d)) !== null) {
            const x =
              Number.parseFloat(match[1]) + Number.parseFloat(match[5]) / 2;
            const y =
              Number.parseFloat(match[2]) + Number.parseFloat(match[6]) / 2;
            const r = Number.parseFloat(match[3]);

            extractedCircles.push({ x, y, r });
            hasCircles = true;
          }

          if (hasCircles) {
            pathsWithCircles.push(path);
          }
        });

        console.log("[v0] Total circles extracted:", extractedCircles.length);
        console.log(
          "[v0] Corner square paths found:",
          cornerSquarePaths.length
        );

        pathsWithCircles.forEach((path) => path.remove());

        if (svgRef.current) {
          const svgElement = doc.documentElement as unknown as SVGSVGElement;
          svgRef.current.innerHTML = svgElement.innerHTML;

          extractedCircles.forEach((circle) => {
            const circleEl = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "circle"
            );
            circleEl.setAttribute("cx", circle.x.toString());
            circleEl.setAttribute("cy", circle.y.toString());
            circleEl.setAttribute("r", circle.r.toString());
            circleEl.setAttribute("fill", "black");
            circleEl.setAttribute("class", "qr-module");
            svgRef.current?.appendChild(circleEl);
          });

          cornerSquarePaths.forEach((path) => {
            const d = path.getAttribute("d") || "";
            // Parse rounded rectangles: M x y h width a... v height...
            const rectPattern =
              /M([\d.]+)\s+([\d.]+)h([\d.]+)[^Mz]*?v([\d.]+)/g;
            let match;

            while ((match = rectPattern.exec(d)) !== null) {
              const x = Number.parseFloat(match[1]);
              const y = Number.parseFloat(match[2]);
              const width = Number.parseFloat(match[3]);
              const height = Number.parseFloat(match[4]);

              const rectEl = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "rect"
              );
              rectEl.setAttribute("x", x.toString());
              rectEl.setAttribute("y", y.toString());
              rectEl.setAttribute("width", width.toString());
              rectEl.setAttribute("height", height.toString());
              rectEl.setAttribute("rx", "0.5");
              rectEl.setAttribute("ry", "0.5");
              rectEl.setAttribute("fill", "black");
              rectEl.setAttribute("class", "qr-corner-rect");
              svgRef.current?.appendChild(rectEl);
            }
          });

          const cornerPathsInSvg = svgRef.current?.querySelectorAll(
            'path[fill*="mainGradient"]'
          );
          cornerPathsInSvg?.forEach((path) => path.remove());

          const timer = setTimeout(() => {
            const allShapes: ShapeData[] = [];

            const circles =
              svgRef.current?.querySelectorAll("circle.qr-module");
            circles?.forEach((circle) => {
              const cx = Number.parseFloat(circle.getAttribute("cx") || "0");
              const cy = Number.parseFloat(circle.getAttribute("cy") || "0");
              const r = Number.parseFloat(circle.getAttribute("r") || "0.5");

              allShapes.push({
                element: circle as SVGElement,
                bounds: { x: cx, y: cy, width: r * 2, height: r * 2 },
                lastPurpleTime: 0,
                targetColor: "#000000",
                currentColor: "#000000",
              });
            });

            const cornerRects = svgRef.current?.querySelectorAll(
              "rect.qr-corner-rect"
            );
            cornerRects?.forEach((rect) => {
              const x = Number.parseFloat(rect.getAttribute("x") || "0");
              const y = Number.parseFloat(rect.getAttribute("y") || "0");
              const width = Number.parseFloat(
                rect.getAttribute("width") || "0"
              );
              const height = Number.parseFloat(
                rect.getAttribute("height") || "0"
              );

              allShapes.push({
                element: rect as SVGElement,
                bounds: { x: x + width / 2, y: y + height / 2, width, height },
                lastPurpleTime: 0,
                targetColor: "#000000",
                currentColor: "#000000",
              });
            });

            console.log("[v0] Total interactive shapes:", allShapes.length);
            setShapes(allShapes);
          }, 50);

          return () => clearTimeout(timer);
        }
      })
      .catch((err) => console.error("[v0] Error loading SVG:", err));
  }, []);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const fadeTime = 4000; // Increased trail fade time from 2 seconds to 4 seconds for longer sustain
      const timeSinceLastHover = now - lastHoverTimeRef.current;
      const hoverCooldown = 1000; // Wait 1 second after hover before starting ambient effect

      shapes.forEach((shapeData) => {
        const timeSinceLastPurple = now - shapeData.lastPurpleTime;

        if (timeSinceLastPurple < fadeTime) {
          // Fade from current color to black (hover effect)
          const fadeRatio = timeSinceLastPurple / fadeTime;
          const currentMatch = shapeData.currentColor.match(
            /rgb$$(\d+), (\d+), (\d+)$$/
          );

          if (currentMatch) {
            const r = Math.round(
              Number.parseInt(currentMatch[1]) * (1 - fadeRatio)
            );
            const g = Math.round(
              Number.parseInt(currentMatch[2]) * (1 - fadeRatio)
            );
            const b = Math.round(
              Number.parseInt(currentMatch[3]) * (1 - fadeRatio)
            );

            shapeData.element.setAttribute("fill", `rgb(${r}, ${g}, ${b})`);
          }
        } else if (timeSinceLastHover > hoverCooldown) {
          // Apply ambient wave effect when not hovering
          const waveSpeed = 0.0008; // Slow wave movement
          const waveX = 15.5 + Math.sin(now * waveSpeed) * 10; // Move horizontally across QR code
          const waveY = 15.5 + Math.cos(now * waveSpeed * 0.7) * 8; // Move vertically with different phase

          const dx = shapeData.bounds.x - waveX;
          const dy = shapeData.bounds.y - waveY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const ambientRadius = 8; // Subtle effect radius
          if (distance < ambientRadius) {
            const ratio = 1 - distance / ambientRadius;
            const intensity = Math.pow(ratio, 3) * 0.3; // Very subtle (30% max intensity)

            const r = Math.round(20 * intensity);
            const g = Math.round(40 * intensity);
            const b = Math.round(60 * intensity);

            shapeData.element.setAttribute("fill", `rgb(${r}, ${g}, ${b})`);
          } else {
            shapeData.element.setAttribute("fill", "#000000");
          }
        } else {
          shapeData.element.setAttribute("fill", "#000000");
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (shapes.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shapes]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || shapes.length === 0) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 31;
    const y = ((e.clientY - rect.top) / rect.height) * 31;

    const now = Date.now();
    lastHoverTimeRef.current = now; // Track last hover time
    const maxDistance = 12; // Increased hover radius from 8 to 12 units for bigger effect area

    shapes.forEach((shapeData) => {
      const dx = x - shapeData.bounds.x;
      const dy = y - shapeData.bounds.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= maxDistance) {
        const color = getModuleColor(distance, maxDistance);
        shapeData.currentColor = color;
        shapeData.lastPurpleTime = now;
        shapeData.element.setAttribute("fill", color);
      }
    });
  };

  const handleMouseLeave = () => {};

  const getModuleColor = (distance: number, maxDistance: number): string => {
    if (distance > maxDistance) {
      return "#000000";
    }

    const ratio = 1 - distance / maxDistance;
    const intensity = Math.pow(ratio, 2);

    // Metallic blue uses cyan highlights for shine effect
    const r = Math.round(70 * intensity); // Slight red for depth
    const g = Math.round(130 * intensity); // Medium green for cyan tint
    const b = Math.round(200 * intensity); // Full blue for base color

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-40 rounded-lg  inline-block items-center mx-auto bg-gray-100 justify-center cursor-pointer overflow-hidden border border-white/20"
    >
      <svg
        ref={svgRef}
        className="w-36 h-40 mx-auto"
        viewBox="0 0 31 31"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}
