import React, { useState, useEffect, useMemo } from 'react';
import { arc } from 'd3-shape';

// Formats number into clean compact financial notation: e.g. 0, -100, 800, 2.1K
const formatCompactValue = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  const num = Number(val);
  if (num === 0) return '0';

  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs >= 1000000) {
    return `${sign}${(abs / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (abs >= 1000) {
    return `${sign}${(abs / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `${sign}${abs.toLocaleString('en-US', { maximumFractionDigits: 1 })}`;
};

// Geometry constants matching BudgetBakers reference image:
// - Outer radius = 80, Inner radius = 61.5 (thickness ~ 18.5)
// - Corner radius = 3.5 (smoothly rounded corners on all arc tips & gaps)
// - Needle length = 57 (stops right before the inner arc boundary)
// - Hub circle radius = 8.5
const R_OUTER = 80;
const R_INNER = 61.5;
const CORNER_RADIUS = 3.5;
const toRad = (deg) => (deg * Math.PI) / 180;

// High-precision annular wedge paths generated via d3-shape
const arcGen = arc()
  .innerRadius(R_INNER)
  .outerRadius(R_OUTER)
  .cornerRadius(CORNER_RADIUS);

// 1. Red Segment: [-130° to -44°]
const RED_PATH = arcGen({ startAngle: toRad(-130), endAngle: toRad(-44) });
// 2. Orange Segment: [-38° to +38°] (Centered symmetrically at 12 o'clock)
const ORANGE_PATH = arcGen({ startAngle: toRad(-38), endAngle: toRad(38) });
// 3. Green Segment: [+44° to +130°]
const GREEN_PATH = arcGen({ startAngle: toRad(44), endAngle: toRad(130) });

export const SpeedometerGauge = ({
  title,
  value,
  income = 0,
  expense = 0,
  balance = 0,
  hint,
}) => {
  const numVal = Number(value || 0);

  // Exact target angle calculation matching user's reference images:
  // - 0° is straight UP (12 o'clock, neutral/baseline)
  // - -65° is mid-left (50% remaining / 50% spent)
  // - -130° is bottom-left (100% finished / 0 balance / deficit in Red zone)
  // - +65° to +130° is right side (surplus / healthy growth in Green zone)
  const currentAngle = useMemo(() => {
    const num = Number(value || 0);
    const bal = Number(balance ?? num ?? 0);
    const inc = Math.max(0, Number(income || 0));
    const exp = Math.max(0, Number(expense || 0));

    // ==========================================
    // 1. BALANCE GAUGE
    // ==========================================
    if (title === 'BALANCE') {
      // 0 or negative balance means funds depleted / empty wallet -> Red (-130°)
      if (bal <= 0) {
        return -130;
      }

      const totalFunds = Math.max(100, bal + exp);

      // When expenses have occurred against a base:
      if (exp > 0 && bal <= 100) {
        const ratio = Math.max(0, Math.min(1, bal / totalFunds));
        return -130 + ratio * 130;
      }

      // If bal <= 100 without expenses:
      if (bal <= 100) {
        const ratio = bal / 100;
        return -130 + ratio * 130;
      }

      // Growth beyond 100: scale smoothly into Green [0° to +130°]
      const growthRatio = Math.min(1, (bal - 100) / 700);
      return growthRatio * 130;
    }

    // ==========================================
    // 2. CASH FLOW GAUGE
    // ==========================================
    if (title === 'CASH FLOW') {
      // Negative cash flow (outflow > inflow) -> Red [-130° to 0°]
      if (num < 0) {
        const base = Math.max(100, exp);
        const ratio = Math.min(1, Math.abs(num) / base);
        // -50 -> -65°, -100 -> -130°
        return -ratio * 130;
      }

      // Neutral cash flow (num === 0):
      if (num === 0) {
        if (exp === 0 && inc === 0) {
          // If balance is 0, danger/red; else neutral 0°
          return bal === 0 ? -130 : 0;
        }
        if (bal === 0) {
          return -130;
        }
        const remaining = bal / (bal + exp);
        return -130 + remaining * 130;
      }

      // Positive cash flow (surplus > 0):
      if (num > 0) {
        if (inc > 0) {
          const savingsRate = Math.min(1, num / inc);
          return -130 + savingsRate * 260; // 0% -> -130°, 50% -> 0°, 100% -> +130°
        }
        const ratio = Math.min(1, num / Math.max(100, bal));
        return ratio * 130;
      }

      return 0;
    }

    // ==========================================
    // 3. SPENDING GAUGE
    // ==========================================
    if (title === 'SPENDING') {
      const absExp = Math.abs(num);

      // Spending 0 -> Straight UP at 12 o'clock (0°)
      if (absExp === 0) {
        return 0;
      }

      // Spending against baseline (100):
      // -50 spent out of 100 -> -65° (mid-left)
      // -100 spent out of 100 -> -130° (bottom-left Red zone)
      const base = Math.max(100, bal + absExp, inc);
      const ratio = Math.min(1, absExp / base);
      return -ratio * 130;
    }

    return 0;
  }, [title, value, balance, income, expense]);

  // Page reload / login animation: needle starts at max (+130°), then sweeps smoothly down to target value
  const [displayAngle, setDisplayAngle] = useState(130);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayAngle(currentAngle);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentAngle]);

  // Display value
  const displayValue = formatCompactValue(numVal);

  return (
    <div
      className="flex flex-col items-center justify-center p-0.5 rounded-xl transition-all select-none relative group w-full"
      title={hint || `${title}: ${numVal}`}
    >
      {/* Precision 3-segmented horseshoe gauge - zoomed/enlarged to fill dashboard card */}
      <div className="relative w-full max-w-[195px] 2xl:max-w-[225px] aspect-[166/138] flex items-center justify-center">
        <svg
          viewBox="7 5 166 138"
          className="w-full h-full overflow-visible"
        >
          {/* Centered coordinate origin at (90, 88) */}
          <g transform="translate(90, 88)">
            {/* 1. Red Segment (Left) - #FE3B2C */}
            <path
              d={RED_PATH}
              fill="#FE3B2C"
              className="transition-all duration-300"
            />

            {/* 2. Orange Segment (Top Center) - #FFA000 */}
            <path
              d={ORANGE_PATH}
              fill="#FFA000"
              className="transition-all duration-300"
            />

            {/* 3. Green Segment (Right) - #21CB87 */}
            <path
              d={GREEN_PATH}
              fill="#21CB87"
              className="transition-all duration-300"
            />

            {/* Needle Arm - smooth pointer with rounded tip extending right into the middle of the colored arc line */}
            <g
              transform={`rotate(${displayAngle})`}
              style={{
                transition: 'transform 1.15s cubic-bezier(0.2, 0.9, 0.3, 1)',
              }}
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-71"
                stroke="#354052"
                strokeWidth="5.5"
                strokeLinecap="round"
                className="stroke-[#354052] dark:stroke-slate-200"
              />
            </g>

            {/* Solid Center Pivot Hub */}
            <circle
              cx="0"
              cy="0"
              r="8.5"
              fill="#354052"
              className="fill-[#354052] dark:fill-slate-200"
            />
          </g>
        </svg>
      </div>

      {/* Label: Slate gray uppercase bold with clean tracking */}
      <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#868E96] dark:text-slate-400 mt-1.5">
        {title}
      </span>

      {/* Value: Sleek, proportional bold font matching reference */}
      <span className="text-[14px] sm:text-[15.5px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-0.5">
        {displayValue}
      </span>
    </div>
  );
};

export default SpeedometerGauge;
