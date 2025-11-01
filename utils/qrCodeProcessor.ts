export interface ShapeData {
  element: SVGElement;
  bounds: { x: number; y: number; width: number; height: number };
  lastPurpleTime: number;
  targetColor: string;
  currentColor: string;
}

export interface ExtractedCircle {
  x: number;
  y: number;
  r: number;
}

export interface ExtractedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function fetchAndParseSVG(svgPath: string): Promise<{
  circles: ExtractedCircle[];
  cornerRects: ExtractedRect[];
  svgContent: string;
}> {
  const response = await fetch(svgPath);
  const svgText = await response.text();
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  
  return processSVGDocument(doc);
}

export function processSVGDocument(doc: Document): {
  circles: ExtractedCircle[];
  cornerRects: ExtractedRect[];
  svgContent: string;
} {
  const paths = doc.querySelectorAll("path");
  const extractedCircles: ExtractedCircle[] = [];
  const cornerRects: ExtractedRect[] = [];

  paths.forEach((path) => {
    const d = path.getAttribute("d") || "";
    const fill = path.getAttribute("fill") || "";

    if (fill.includes("url(#mainGradient)")) {
      const rects = extractRectsFromPath(d);
      cornerRects.push(...rects);
    }

    const circles = extractCirclesFromPath(d);
    extractedCircles.push(...circles);
  });

  return {
    circles: extractedCircles,
    cornerRects,
    svgContent: doc.documentElement.innerHTML
  };
}

function extractCirclesFromPath(d: string): ExtractedCircle[] {
  const circles: ExtractedCircle[] = [];
  const circlePattern = /M([\d.]+)\s+([\d.]+)a([\d.]+)\s+([\d.]+)\s+0\s+0\s+1\s+([-\d.]+)\s+([-\d.]+)/g;
  
  let match;
  while ((match = circlePattern.exec(d)) !== null) {
    const x = Number.parseFloat(match[1]) + Number.parseFloat(match[5]) / 2;
    const y = Number.parseFloat(match[2]) + Number.parseFloat(match[6]) / 2;
    const r = Number.parseFloat(match[3]);
    
    circles.push({ x, y, r });
  }
  
  return circles;
}

function extractRectsFromPath(d: string): ExtractedRect[] {
  const rects: ExtractedRect[] = [];
  const rectPattern = /M([\d.]+)\s+([\d.]+)h([\d.]+)[^Mz]*?v([\d.]+)/g;
  
  let match;
  while ((match = rectPattern.exec(d)) !== null) {
    const x = Number.parseFloat(match[1]);
    const y = Number.parseFloat(match[2]);
    const width = Number.parseFloat(match[3]);
    const height = Number.parseFloat(match[4]);
    
    rects.push({ x, y, width, height });
  }
  
  return rects;
}

export function createCircleElement(circle: ExtractedCircle): SVGCircleElement {
  const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circleEl.setAttribute("cx", circle.x.toString());
  circleEl.setAttribute("cy", circle.y.toString());
  circleEl.setAttribute("r", circle.r.toString());
  circleEl.setAttribute("fill", "black");
  circleEl.setAttribute("class", "qr-module");
  return circleEl;
}

export function createRectElement(rect: ExtractedRect): SVGRectElement {
  const rectEl = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rectEl.setAttribute("x", rect.x.toString());
  rectEl.setAttribute("y", rect.y.toString());
  rectEl.setAttribute("width", rect.width.toString());
  rectEl.setAttribute("height", rect.height.toString());
  rectEl.setAttribute("rx", "0.5");
  rectEl.setAttribute("ry", "0.5");
  rectEl.setAttribute("fill", "black");
  rectEl.setAttribute("class", "qr-corner-rect");
  return rectEl;
}

export function createShapeData(circles: ExtractedCircle[], rects: ExtractedRect[]): ShapeData[] {
  const shapes: ShapeData[] = [];
  
  circles.forEach((circle) => {
    const element = createCircleElement(circle);
    shapes.push({
      element,
      bounds: { x: circle.x, y: circle.y, width: circle.r * 2, height: circle.r * 2 },
      lastPurpleTime: 0,
      targetColor: "#000000",
      currentColor: "#000000",
    });
  });
  
  rects.forEach((rect) => {
    const element = createRectElement(rect);
    shapes.push({
      element,
      bounds: { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height },
      lastPurpleTime: 0,
      targetColor: "#000000",
      currentColor: "#000000",
    });
  });
  
  return shapes;
}

export function getModuleColor(distance: number, maxDistance: number): string {
  if (distance > maxDistance) {
    return "#000000";
  }

  const ratio = 1 - distance / maxDistance;
  const intensity = Math.pow(ratio, 2);

  const r = Math.round(70 * intensity);
  const g = Math.round(130 * intensity);
  const b = Math.round(200 * intensity);

  return `rgb(${r}, ${g}, ${b})`;
}