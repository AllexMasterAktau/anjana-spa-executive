export interface CosmeticTreatment {
  name: string;
  duration: string;
  notes: string;
  aroma: string;
  cogs: number;
  recommendedPrice: number;
  products: { name: string; cost: number }[];
  description: string;
  actionSteps: string[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  tagline: string;
  painPoint: string;
  psychographic: string;
  targetPackage: string;
  preferredAroma: string;
  retentionPotential: string;
  barrierBypass: string;
}

export interface MarketingCampaign {
  period: string;
  title: string;
  trigger: string;
  focusArea: string;
  offer: string;
  channels: string[];
  retailHighlight: string;
  b2bAngle: string;
}

export interface InteractiveSimulationInput {
  dailyDaySpaGuests: number;
  avgTreatmentPrice: number;
  restaurantConversionRate: number;
  restaurantAOV: number;
  cosmeticsRetailConversion: number;
  cosmeticsRetailAOV: number;
  daysActive: number;
  capacityLimit: number;
  therapistCommissionRate: number; // e.g. 10%
  vipCabinRentalRate: number; // e.g. 15% booking
  vipCabinPrice: number; // 30,000 KZT
}

export interface ScriptStep {
  title: string;
  scenario: string;
  objection: string;
  scriptResponse: string;
  upsellTip: string;
}
