import React from "react";

interface DissolveFilterProps {
  filterRef?: React.RefObject<SVGFEDisplacementMapElement | null>;
  noiseRef?: React.RefObject<SVGFETurbulenceElement | null>;
}

export function DissolveFilter({ filterRef, noiseRef }: DissolveFilterProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
      <defs>
        <filter
          id="card-dissolve-filter"
          x="-200%"
          y="-200%"
          width="500%"
          height="500%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004"
            numOctaves={1}
            result="bigNoise"
            ref={noiseRef}
          />
          <feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
            <feFuncR type="linear" slope="5" intercept="-2" />
            <feFuncG type="linear" slope="5" intercept="-2" />
          </feComponentTransfer>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1"
            numOctaves={1}
            result="fineNoise"
          />
          <feMerge result="mergedNoise">
            <feMergeNode in="bigNoiseAdjusted" />
            <feMergeNode in="fineNoise" />
          </feMerge>
          <feDisplacementMap
            in="SourceGraphic"
            in2="mergedNoise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
            ref={filterRef}
          />
        </filter>
      </defs>
    </svg>
  );
}
