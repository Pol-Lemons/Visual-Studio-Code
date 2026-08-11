import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, Grid3X3, List, X, ChevronDown, SlidersHorizontal,
  Zap, Gauge, Fuel, Scale, ArrowRight, Plus, Check, GitCompare,
  Star, ChevronLeft, ChevronRight, LayoutGrid
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const BRANDS = ["All","Toyota", "Honda", "Tesla"];

interface Trim {
  name: string;
  price: number;
  hp: number;
  totalMonthly: string;
  zeroToSixty?: string;

  cityMpg?: number;
  hwyMpg?: number;
  insuranceMonthly?: number;
  maintenanceBase?: number;
}

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  badge?: string;
  rating: number;
  trims: Trim[];
  specs: {
    engine: string;
    transmission: string;
    drivetrain: string;
    economy: string;
    fuelType: string;
  };
}

const CARS: Car[] = [
  {
    id: "toyota-camry-xse",
    brand: "Toyota",
    model: "Camry",
    year: 2026,
    image: "https://www.goodcarbadcar.net/wp-content/uploads/2025/05/2026_Camry_XSE_AWD_HeavyMetalBlackRoof_001-1500x990-1.jpg",
    badge: "Popular",
    rating: 4.9,
    trims: [
      { name: "LE", price: 29000, hp: 225, totalMonthly: "$300-$500" },
      { name: "SE", price: 31000, hp: 225, totalMonthly: "$320-$530" },
      { name: "XLE", price: 34000, hp: 232, totalMonthly: "$350-$570" },
      { name: "XSE", price: 36000, hp: 232, totalMonthly: "$330-$553" },
    ],
    specs: {
      engine: "2.5L Inline-4 Hybrid",
      transmission: "E-CVT automatic transmission",
      drivetrain: "FWD or AWD",
      economy: "45 / 47 mpg",
      fuelType: "Gasoline Hybrid",
    },
  },

  {
    id: "honda-civic-sport",
    brand: "Honda",
    model: "Civic",
    year: 2026,
    image: "https://media.ed.edmunds-media.com/honda/civic/2026/oem/2026_honda_civic_sedan_si_fq_oem_1_1280.jpg",
    badge: "Efficient",
    rating: 4.8,
    trims: [
      { name: "LX", price: 25000, hp: 150, totalMonthly: "$280-$460" },
      { name: "Sport", price: 27000, hp: 150, totalMonthly: "$300-$490" },
      { name: "Hybrid", price: 30000, hp: 200, totalMonthly: "$320-$520" },
      { name: "Si", price: 31000, hp: 200, totalMonthly: "$340-$560" },
    ],
    specs: {
      engine: "2.0L Inline-4 / Hybrid / 1.5L Turbocharged",
      transmission: "CVT / 6-speed manual on Si",
      drivetrain: "FWD",
      economy: "32 / 41 mpg",
      fuelType: "Gasoline or Hybrid",
      
    },
  },

  {
    id: "honda-accord-ex",
    brand: "Honda",
    model: "Accord",
    year: 2026,
    image: "https://tse2.mm.bing.net/th/id/OIP.jpmBgWUzOsBXeBHwzLCmpQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    badge: "Family Pick",
    rating: 4.8,
    trims: [
      { name: "LX", price: 29000, hp: 192, totalMonthly: "$320-$520" },
      { name: "EX", price: 31000, hp: 192, totalMonthly: "$340-$550" },
      { name: "Sport Hybrid", price: 34000, hp: 204, totalMonthly: "$360-$590" },
      { name: "Touring Hybrid", price: 39000, hp: 204, totalMonthly: "$410-$660" },
    ],
    specs: {
      engine: "1.5L Turbo / 2.0L Hybrid",
      transmission: "CVT / E-CVT",
      drivetrain: "FWD",
      economy: "29 / 37 mpg",
      fuelType: "Gasoline or Hybrid",
      
    },
  },

  {
    id: "toyota-corolla-se",
    brand: "Toyota",
    model: "Corolla",
    year: 2026,
    image: "https://pressroom.toyota.com/wp-content/uploads/2025/07/Thumbnail_2026_Corolla_XSE_WindChillPearl_EXT_B_ROLL-1500x900.png",
    badge: "Low Cost",
    rating: 4.7,
    trims: [
      { name: "LE", price: 23000, hp: 169, totalMonthly: "$260-$430" },
      { name: "SE", price: 25000, hp: 169, totalMonthly: "$280-$460" },
      { name: "XSE", price: 29000, hp: 169, totalMonthly: "$310-$510" },
      { name: "Hybrid", price: 26000, hp: 138, totalMonthly: "$270-$450" },
    ],
    specs: {
      engine: "2.0L Inline-4 / Hybrid available",
      transmission: "CVT",
      drivetrain: "FWD or AWD Hybrid",
      economy: "32 / 41 mpg",
      fuelType: "Gasoline or Hybrid",
      
    },
  },

  {
    id: "toyota-rav4-xle",
    brand: "Toyota",
    model: "RAV4",
    year: 2026,
    image: "https://www.examiner.com.au/images/transform/v1/crop/frm/silverstone-feed-data/6a30c655-90f6-4cb5-b0ec-2404e8ce1e92.jpg/r0_0_1490_790_w1200_h678_fmax.jpg",
    badge: "SUV Pick",
    rating: 4.8,
    trims: [
      { name: "LE", price: 31000, hp: 203, totalMonthly: "$350-$570" },
      { name: "XLE", price: 34000, hp: 203, totalMonthly: "$380-$610" },
      { name: "Adventure", price: 38000, hp: 203, totalMonthly: "$420-$670" },
      { name: "Hybrid XSE", price: 41000, hp: 219, totalMonthly: "$440-$700" },
    ],
    specs: {
      engine: "2.5L Inline-4 / Hybrid available",
      transmission: "8-speed automatic / E-CVT Hybrid",
      drivetrain: "FWD or AWD",
      economy: "27 / 35 mpg",
      fuelType: "Gasoline or Hybrid",
      
    },
  },

  {
    id: "tesla-model-3-long-range",
    brand: "Tesla",
    model: "Model 3",
    year: 2026,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=500&fit=crop&auto=format",
    badge: "Electric",
    rating: 4.7,
    trims: [
      { name: "RWD", price: 39000, hp: 283, totalMonthly: "$430-$690" },
      { name: "Long Range", price: 45000, hp: 394, totalMonthly: "$480-$760" },
      { name: "Performance", price: 53000, hp: 510, totalMonthly: "$560-$880" },
    ],
    specs: {
      engine: "Electric Motor",
      transmission: "Single-speed automatic",
      drivetrain: "RWD or AWD",
      economy: "Electric range estimate",
      fuelType: "Electric",
      
    },
  },
];
// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "$" + n.toLocaleString();
}
function toNumberOrEmpty(value: string){
  return value == ""?"" : Number(value);
}

const CURRENT_YEAR = 2026;

type Condition = "excellent" | "good" | "fair" | "poor";



interface CostInputs {
  usedYear: number |"";
  mileage: number| "";
  condition: Condition|"";
  milesPerYear: number|"";
  gasPrice: number|"";
  downPayment: number|"";
  loanMonths: number;
}
interface GenerationOptions {
  id: string;
  label: string;
  startYear: number;
  endYear : number;
  estimatedYear: number;
}
const GENERATION_OPTIONS: GenerationOptions[] = [
  {
    id:"older-used",
    label: "2018-2024 XV70 GEN",
    startYear: 2018,
    endYear: 2024,
    estimatedYear: 2021,
  },
  {
    id:"previous-gen",
    label: "2012-2017 XV50 Gen",
    startYear: 2012,
    endYear:2017,
    estimatedYear: 2014,
  }
]

function calculateCarCost(trim: Trim, inputs: CostInputs) {
  const usedYear = inputs.usedYear === "" ? CURRENT_YEAR : inputs.usedYear;
  const mileage = inputs.mileage === "" ? 0 : inputs.mileage;
  const condition = inputs.condition === "" ? "good" : inputs.condition;
  const milesPerYear = inputs.milesPerYear === "" ? 12000 : inputs.milesPerYear;
  const gasPrice = inputs.gasPrice === "" ? 4.8 : inputs.gasPrice;
  const downPayment = inputs.downPayment === "" ? 3000 : inputs.downPayment;

  const age = Math.max(0, CURRENT_YEAR - usedYear);

  let usedPrice = trim.price;

  usedPrice -= age * 1200;
  usedPrice -= mileage * 0.08;

  const conditionMultiplier: Record<Condition, number> = {
    excellent: 1.05,
    good: 1.0,
    fair: 0.9,
    poor: 0.8,
  };

  usedPrice *= conditionMultiplier[condition];
  usedPrice = Math.max(usedPrice, 1000);

  const cityMpg = trim.cityMpg ?? 28;
  const hwyMpg = trim.hwyMpg ?? 36;
  const averageMpg = (cityMpg + hwyMpg) / 2;

  const gasMonthly = (milesPerYear / 12 / averageMpg) * gasPrice;

  const insuranceMonthly = trim.insuranceMonthly ?? 170;
  const maintenanceMonthly = (trim.maintenanceBase ?? 70) + age * 8;

  const safeLoanMonths = Math.max(inputs.loanMonths, 1);
  const financedAmount = Math.max(usedPrice - downPayment, 0);
  const paymentMonthly = financedAmount / safeLoanMonths;

  const totalMonthly =
    paymentMonthly + gasMonthly + insuranceMonthly + maintenanceMonthly;

  return {
    usedPrice: Math.round(usedPrice),
    paymentMonthly: Math.round(paymentMonthly),
    gasMonthly: Math.round(gasMonthly),
    insuranceMonthly: Math.round(insuranceMonthly),
    maintenanceMonthly: Math.round(maintenanceMonthly),
    totalMonthly: Math.round(totalMonthly),
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={10}
          className={s <= Math.round(rating) ? "text-accent fill-accent" : "text-muted-foreground"}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

const SPEC_ICONS: Record<string, React.ReactNode> = {
  engine: <Zap size={13} />,
  torque: <Gauge size={13} />,
  topSpeed: <ArrowRight size={13} />,
  economy: <Fuel size={13} />,
  weight: <Scale size={13} />,
};

const SPEC_LABELS: Record<string, string> = {
  engine: "Engine",
  transmission: "Transmission",
  drivetrain: "Drivetrain",
  economy: "Economy",
  fuelType: "Fuel Type",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrimTabs({
  trims,
  selected,
  onChange,
}: {
  trims: Trim[];
  selected: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {trims.map((t, i) => (
        <button
          key={t.name}
          onClick={(e) => { e.stopPropagation(); onChange(i); }}
          className={`px-2.5 py-1 text-xs rounded transition-all duration-200 border ${
            selected === i
              ? "bg-primary/20 border-primary text-primary"
              : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          }`}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}

function CarCard({
  car,
  trimIdx,
  onTrimChange,
  inCompare,
  onCompareToggle,
  onViewDetails,
  listView,
  costInputs,
}: {
  car: Car;
  trimIdx: number;
  onTrimChange: (i: number) => void;
  inCompare: boolean;
  onCompareToggle: () => void;
  onViewDetails: () => void;
  listView: boolean;
  costInputs: CostInputs;
}) {
  const trim = car.trims[trimIdx];
  const cost = calculateCarCost(trim, costInputs);
  if (listView) {
    return (
      <div
        className="group flex gap-0 border border-border hover:border-primary/40 rounded transition-all duration-300 overflow-hidden bg-card"
        style={{ boxShadow: "0 0 0 0 rgba(14,165,233,0)", transition: "box-shadow 0.3s, border-color 0.3s" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(14,165,233,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        <div className="relative w-56 flex-shrink-0 bg-muted overflow-hidden">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60" />
          {car.badge && (
            <span
              className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 text-xs"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
            >
              {car.badge}
            </span>
          )}
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs text-primary tracking-widest uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {car.brand}
                </span>
                <span className="text-border">·</span>
                <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {car.year}
                </span>
              </div>
              <h3
                className="text-foreground font-semibold text-lg leading-tight mb-1"
                style={{ fontFamily: "'Oxanium', sans-serif" }}
              >
                {car.model}
              </h3>
              <Stars rating={car.rating} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Oxanium', sans-serif" }}>
                {fmt(cost.usedPrice)}
              </div>
              <div className="text-xs text-muted-foreground">Estimated Used Price</div>
            </div>
          </div>
          <div className="flex items-center gap-6 my-3">
            {[
  { label: "Total/mo", val: fmt(cost.totalMonthly) },
  { label: "Gas/mo", val: fmt(cost.gasMonthly) },
  { label: "Insurance", val: fmt(cost.insuranceMonthly) },
].map((s) => (
              <div key={s.label}>
                <div
                  className="text-base font-medium text-accent"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {s.val}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <TrimTabs trims={car.trims} selected={trimIdx} onChange={onTrimChange} />
            <div className="flex gap-2">
              <button
                onClick={onCompareToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded transition-all duration-200 ${
                  inCompare
                    ? "bg-primary/20 border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
              >
                {inCompare ? <Check size={11} /> : <Plus size={11} />}
                Compare
              </button>
              <button
                onClick={onViewDetails}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-sky-400 transition-colors duration-200"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
              >
                Details <ChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group flex flex-col border border-border hover:border-primary/40 rounded transition-all duration-300 overflow-hidden bg-card"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(14,165,233,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div className="relative h-44 bg-muted overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        {car.badge && (
          <span
            className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-0.5 text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}
          >
            {car.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onCompareToggle(); }}
          className={`absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded border transition-all duration-200 ${
            inCompare
              ? "bg-primary border-primary text-white"
              : "bg-card/80 border-border text-muted-foreground hover:border-primary hover:text-primary backdrop-blur-sm"
          }`}
        >
          {inCompare ? <Check size={12} /> : <Plus size={12} />}
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-xs text-primary tracking-widest uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {car.brand}
            </span>
            <span className="text-border text-xs">·</span>
            <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {car.year}
            </span>
          </div>
          <h3
            className="text-foreground font-semibold leading-tight"
            style={{ fontFamily: "'Oxanium', sans-serif", fontSize: "1.05rem" }}
          >
            {car.model}
          </h3>
          <Stars rating={car.rating} />
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-y border-border">
  {[
    { label: "Total/mo", val: fmt(cost.totalMonthly) },
    { label: "Gas/mo", val: fmt(cost.gasMonthly) },
    { label: "Insurance", val: fmt(cost.insuranceMonthly) },
  ].map((s) => (
    <div key={s.label} className="text-center">
      <div
        className="text-sm font-medium text-accent"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {s.val}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
    </div>
  ))}
</div>

<TrimTabs trims={car.trims} selected={trimIdx} onChange={onTrimChange} />

<div className="flex items-center justify-between mt-auto pt-1">
  <div>
    <div className="text-lg font-bold text-foreground" style={{ fontFamily: "'Oxanium', sans-serif" }}>
      {fmt(cost.usedPrice)}
    </div>
    <div className="text-xs text-muted-foreground">Estimated Used Price</div>
  </div>
          </div>
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-primary text-primary-foreground rounded hover:bg-sky-400 transition-colors duration-200"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px" }}
          >
            View <ChevronRight size={11} />
          </button>
        </div>
      </div>

  );
}

function SpecsPanel({
  car,
  trimIdx,
  onTrimChange,
  onClose,
  inCompare,
  onCompareToggle,
  costInputs,
}: {
  car: Car | null;
  trimIdx: number;
  onTrimChange: (i: number) => void;
  onClose: () => void;
  inCompare: boolean;
  onCompareToggle: () => void;
  costInputs : CostInputs;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (car) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [car]);

  if (!car) return null;
  const trim = car.trims[trimIdx];
  const cost = calculateCarCost(trim, costInputs);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-stretch justify-end"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg bg-card border-l border-border flex flex-col overflow-hidden"
        style={{ animation: "slideInRight 0.3s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <span
              className="text-xs text-primary tracking-widest uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {car.brand}
            </span>
            <h2
              className="text-xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "'Oxanium', sans-serif" }}
            >
              {car.model}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        <div className="relative h-52 bg-muted flex-shrink-0 overflow-hidden">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <TrimTabs trims={car.trims} selected={trimIdx} onChange={onTrimChange} />
          </div>
        </div>

        {/* Key stats */}
       <div className="grid grid-cols-3 border-b border-border">
  {[
    { label: "Used Price", val: fmt(cost.usedPrice) },
    { label: "Payment/mo", val: fmt(cost.paymentMonthly) },
    { label: "Total/mo", val: fmt(cost.totalMonthly) },
  ].map((s) => (
    <div key={s.label} className="p-4 text-center border-r last:border-r-0 border-border">
      <div
        className="text-lg font-bold text-accent"
        style={{ fontFamily: "'Oxanium', sans-serif" }}
      >
        {s.val}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
    </div>
  ))}
</div>

        {/* Full Specs */}
        <div className="flex-1 overflow-y-auto p-6">
          <p
            className="text-xs text-primary tracking-widest uppercase mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Full Specifications
          </p>
          <div className="flex flex-col divide-y divide-border">
            {Object.entries(car.specs).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary/70">{SPEC_ICONS[key] ?? <SlidersHorizontal size={13} />}</span>
                  <span className="text-sm">{SPEC_LABELS[key] ?? key}</span>
                </div>
                <span
                  className="text-sm text-foreground font-medium"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-1 overflow-y-auto p-6">
  <p
    className="text-xs text-primary tracking-widest uppercase mb-4"
    style={{ fontFamily: "'JetBrains Mono', monospace" }}
  >
     Monthly Cost Breakdown 
  </p>

  <div className="flex flex-col divide-y divide-border border border-border rounded overflow-hidden">
    {[
      { label: "Estimated Used Price", value: fmt(cost.usedPrice) },
      { label: "Monthly Payment", value: fmt(cost.paymentMonthly) },
      { label: "Gas Monthly", value: fmt(cost.gasMonthly) },
      { label: "Insurance Monthly", value: fmt(cost.insuranceMonthly) },
      { label: "Maintenance Monthly", value: fmt(cost.maintenanceMonthly) },
      { label: "Total Monthly Cost", value: fmt(cost.totalMonthly) },
    ].map((item) => (
      <div key={item.label} className="flex items-center justify-between px-4 py-3 bg-muted/20">
        <span className="text-sm text-muted-foreground">{item.label}</span>
        <span
          className="text-sm font-bold text-foreground"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {item.value}
        </span>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}

function CompareModal({
  cars,
  trims,
  onClose,
  onRemove,
}: {
  cars: Car[];
  trims: Record<string, number>;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const specKeys = Object.keys(SPEC_LABELS) as (keyof Car["specs"])[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-5xl bg-card border border-border rounded overflow-hidden flex flex-col max-h-[90vh]"
        style={{ animation: "fadeScaleIn 0.25s ease" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2
            className="text-lg font-bold text-foreground flex items-center gap-2"
            style={{ fontFamily: "'Oxanium', sans-serif" }}
          >
            <GitCompare size={18} className="text-primary" />
            Compare Vehicles
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-xs text-muted-foreground w-36" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  SPEC
                </th>
                {cars.map((car) => {
                  const t = car.trims[trims[car.id] ?? 0];
                  return (
                    <th key={car.id} className="p-4 text-center border-l border-border relative">
                      <button
                        onClick={() => onRemove(car.id)}
                        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <X size={12} />
                      </button>
                      <div className="relative h-24 bg-muted rounded overflow-hidden mb-2">
                        <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent" />
                      </div>
                      <div
                        className="text-xs text-primary tracking-wider"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {car.brand}
                      </div>
                      <div
                        className="text-sm font-semibold text-foreground leading-tight"
                        style={{ fontFamily: "'Oxanium', sans-serif" }}
                      >
                        {car.model}
                      </div>
                      <div
                        className="text-xs text-accent mt-0.5"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {fmt(t.price)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-muted/30">
                <td className="p-4 text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>HP</td>
                {cars.map((car) => (
                  <td key={car.id} className="p-4 text-center border-l border-border">
                    <span className="text-sm font-bold text-accent" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {car.trims[trims[car.id] ?? 0].hp}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Insurance monthly</td>
                {cars.map((car) => (
                  <td key={car.id} className="p-4 text-center border-l border-border">
                    <span className="text-sm font-bold text-accent" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {car.trims[trims[car.id] ?? 0].totalMonthly}
                    </span>
                  </td>
                ))}
              </tr>
              {specKeys.map((key, i) => (
                <tr key={key} className={`border-b border-border ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                  <td
                    className="p-4 text-xs text-muted-foreground"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {SPEC_LABELS[key]}
                  </td>
                  {cars.map((car) => (
                    <td
                      key={car.id}
                      className="p-4 text-center text-sm text-foreground border-l border-border"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}
                    >
                      {car.specs[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [costInputs, setCostInputs] = useState<CostInputs>({
  usedYear: "",
  mileage: "",
  condition: "",
  milesPerYear: "",
  gasPrice: "",
  downPayment: "",
  loanMonths: 60,
});
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTrims, setSelectedTrims] = useState<Record<string, number>>({});
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [detailCarId, setDetailCarId] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const getTrimIdx = (id: string) => selectedTrims[id] ?? 0;

  const setTrimIdx = (id: string, i: number) =>
    setSelectedTrims((prev) => ({ ...prev, [id]: i }));

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const filtered = useMemo(() => {
    let list = CARS.filter((c) => {
      const q = query.toLowerCase();
      const matchSearch =
        !q ||
        c.model.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.year.toString().includes(q);
      const matchBrand = brand === "All" || c.brand === brand;
      return matchSearch && matchBrand;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.trims[0].price - b.trims[0].price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.trims[0].price - a.trims[0].price);
    if (sortBy === "hp") list = [...list].sort((a, b) => b.trims[0].hp - a.trims[0].hp);
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [query, brand, sortBy]);

  const detailCar = detailCarId ? CARS.find((c) => c.id === detailCarId) ?? null : null;
  const compareCars = CARS.filter((c) => compareIds.includes(c.id));

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.2); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(14,165,233,0.4); }
      `}</style>

      <div
        className="min-h-screen bg-background text-foreground"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── NAV ── */}
        <header
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
            scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary flex items-center justify-center rounded-sm">
                <LayoutGrid size={14} className="text-white" />
              </div>
              <span
                className="text-lg font-bold tracking-wider text-foreground"
                style={{ fontFamily: "'Oxanium', sans-serif" }}
              >
                Car<span className="text-primary">Tech</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-7">
              {["Browse", "Compare", "Electric", "New Arrivals"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {l}
                </a>
              ))}
            </nav>
            <button
              className="hidden md:flex items-center gap-2 text-xs border border-primary/50 text-primary px-4 py-1.5 rounded hover:bg-primary/10 transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Sign In
            </button>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="relative h-[92vh] min-h-[560px] flex items-end overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-background">
            <img
              src="https://images.unsplash.com/photo-1705563666935-4d0a72709948?w=1920&h=1080&fit=crop&fm=png"
              alt="Futuristic car in dark studio"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgba(14,165,233,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,1) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 pb-16 w-full">
            <div className="max-w-2xl mb-10">
              <p
                className="text-primary text-xs tracking-[0.35em] uppercase mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Next-Gen Automotive Intelligence
              </p>
              <h1
                className="font-bold uppercase text-foreground leading-none mb-5"
                style={{
                  fontFamily: "'Oxanium', sans-serif",
                  fontSize: "clamp(3rem, 7vw, 6rem)",
                  lineHeight: 1.0,
                }}
              >
                Find Your
                <br />
                <span className="text-primary" style={{ textShadow: "0 0 40px rgba(14,165,233,0.4)" }}>
                  Perfect
                </span>
                <br />
                Machine
              </h1>
              <p className="text-muted-foreground text-base font-light leading-relaxed">
                Browse {CARS.length} elite vehicles. Filter, compare, and configure with precision.
              </p>
            </div>

            {/* Search bar */}
            <div className="relative max-w-xl">
              <div className="flex items-center gap-3 bg-card/80 backdrop-blur border border-border rounded px-4 py-3 focus-within:border-primary/60 transition-colors duration-200">
                <Search size={16} className="text-muted-foreground flex-shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by brand, model, or year..."
                  className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 max-w-xl">
  <input
    type="number"
    value={costInputs.usedYear}
    onChange={(e) =>
      setCostInputs({ ...costInputs, usedYear: toNumberOrEmpty(e.target.value) })
    }
    placeholder="Year"
    className="bg-card/80 border border-border text-foreground text-xs px-3 py-2 rounded outline-none focus:border-primary/60"
  />

  <input
    type="number"
    value={costInputs.mileage}
    onChange={(e) =>
      setCostInputs({ ...costInputs, mileage: toNumberOrEmpty(e.target.value) })
    }
    placeholder="Mileage"
    className="bg-card/80 border border-border text-foreground text-xs px-3 py-2 rounded outline-none focus:border-primary/60"
  />

  <select
    value={costInputs.condition}
    onChange={(e) =>
      setCostInputs({
        ...costInputs,
        condition: e.target.value as Condition | "",
      })
    }
    className="bg-card/80 border border-border text-foreground text-xs px-3 py-2 rounded outline-none focus:border-primary/60"
  > 
    <option value="moreoptions">Choose your condition</option>
    <option value="excellent">Excellent</option>
    <option value="good">Good</option>
    <option value="fair">Fair</option>
    <option value="poor">Poor</option>
  </select>

  <input
    type="number"
    value={costInputs.milesPerYear}
    onChange={(e) =>
      setCostInputs({ ...costInputs, milesPerYear: Number(e.target.value) })
    }
    placeholder="Miles/year"
    className="bg-card/80 border border-border text-foreground text-xs px-3 py-2 rounded outline-none focus:border-primary/60"
  />

  <input
    type="number"
    value={costInputs.gasPrice}
    onChange={(e) =>
      setCostInputs({ ...costInputs, gasPrice: toNumberOrEmpty(e.target.value) })
    }
    placeholder="Gas price"
    className="bg-card/80 border border-border text-foreground text-xs px-3 py-2 rounded outline-none focus:border-primary/60"
  />

  <input
    type="number"
    value={costInputs.downPayment}
    onChange={(e) =>
      setCostInputs({ ...costInputs, downPayment: toNumberOrEmpty(e.target.value) })
    }
    placeholder="Down payment"
    className="bg-card/80 border border-border text-foreground text-xs px-3 py-2 rounded outline-none focus:border-primary/60"
  />
</div>
              {/* Glow */}
              <div
                className="absolute -inset-0.5 rounded pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.1), transparent)", filter: "blur(8px)" }}
              />
            </div>
          </div>
        </section>

        {/* ── BROWSE ── */}
        <section className="max-w-7xl mx-auto px-5 py-10">
          {/* Brand filters */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span
              className="text-xs text-muted-foreground mr-2 flex items-center gap-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <SlidersHorizontal size={12} /> Brand
            </span>
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`px-4 py-1.5 text-xs rounded border transition-all duration-200 ${
                  brand === b
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <p className="text-sm text-muted-foreground">
              <span
                className="text-foreground font-medium"
                style={{ fontFamily: "'Oxanium', sans-serif" }}
              >
                {filtered.length}
              </span>{" "}
              vehicles found
            </p>
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-card border border-border text-foreground text-xs px-3 py-2 pr-7 rounded outline-none focus:border-primary/60 cursor-pointer"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="hp">Horsepower</option>
                  <option value="rating">Rating</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              {/* View toggle */}
              <div className="flex border border-border rounded overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 border-l border-border transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Cars grid / list */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search size={36} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">No vehicles match your search.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  trimIdx={getTrimIdx(car.id)}
                  onTrimChange={(i) => setTrimIdx(car.id, i)}
                  inCompare={compareIds.includes(car.id)}
                  onCompareToggle={() => toggleCompare(car.id)}
                  onViewDetails={() => setDetailCarId(car.id)}
                  listView={false}
                  costInputs={costInputs}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  trimIdx={getTrimIdx(car.id)}
                  onTrimChange={(i) => setTrimIdx(car.id, i)}
                  inCompare={compareIds.includes(car.id)}
                  onCompareToggle={() => toggleCompare(car.id)}
                  onViewDetails={() => setDetailCarId(car.id)}
                  listView={true}
                  costInputs={costInputs}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-border mt-12 py-8 px-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <span
              className="text-sm font-bold text-foreground"
              style={{ fontFamily: "'Oxanium', sans-serif" }}
            >
              Car<span className="text-primary">Tech</span>
            </span>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              © 2025 CarTech Automotive Intelligence Platform
            </p>
          </div>
        </footer>
      </div>

      {/* ── SPECS DRAWER ── */}
      {detailCar && (
        <SpecsPanel
          car={detailCar}
          trimIdx={getTrimIdx(detailCar.id)}
          onTrimChange={(i) => setTrimIdx(detailCar.id, i)}
          onClose={() => setDetailCarId(null)}
          inCompare={compareIds.includes(detailCar.id)}
          onCompareToggle={() => toggleCompare(detailCar.id)}
          costInputs={costInputs}
        />
      )}

      {/* ── COMPARE STICKY BAR ── */}
      {compareIds.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border px-5 py-3"
          style={{ animation: "slideUp 0.3s ease", boxShadow: "0 -8px 32px rgba(14,165,233,0.08)" }}
        >
          <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
            <span
              className="text-xs text-muted-foreground flex items-center gap-1.5 mr-1"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <GitCompare size={12} className="text-primary" />
              Comparing ({compareIds.length}/3)
            </span>
            <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
              {compareCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center gap-2 bg-muted border border-border rounded px-2.5 py-1.5"
                >
                  <img src={car.image} alt={car.model} className="w-8 h-5 object-cover rounded-sm" />
                  <span
                    className="text-xs text-foreground"
                    style={{ fontFamily: "'Oxanium', sans-serif" }}
                  >
                    {car.model}
                  </span>
                  <button
                    onClick={() => toggleCompare(car.id)}
                    className="text-muted-foreground hover:text-foreground ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 ml-auto flex-shrink-0">
              <button
                onClick={() => setCompareIds([])}
                className="text-xs border border-border text-muted-foreground px-3 py-1.5 rounded hover:border-foreground/30 hover:text-foreground transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Clear
              </button>
              <button
                onClick={() => setShowCompare(true)}
                disabled={compareIds.length < 2}
                className="text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <GitCompare size={12} />
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPARE MODAL ── */}
      {showCompare && (
        <CompareModal
          cars={compareCars}
          trims={selectedTrims}
          onClose={() => setShowCompare(false)}
          onRemove={(id) => {
            toggleCompare(id);
            if (compareIds.length <= 2) setShowCompare(false);
          }}
        />
      )}
    </>
  );
}
