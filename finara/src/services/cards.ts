// ====================================================================
// FINARA CARDS MANAGEMENT SERVICE
// Virtual & Physical Card Issuance & Granular Spending Controls
// ====================================================================

export interface CardControls {
  allowOnline: boolean;
  allowAtm: boolean;
  allowContactless: boolean;
  allowInternational: boolean;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface CardModel {
  id: string;
  userId: string;
  type: 'virtual' | 'physical';
  brand: 'VISA' | 'MASTERCARD';
  maskedPan: string;
  lastFour: string;
  exp: string;
  status: 'active' | 'frozen' | 'terminated';
  controls: CardControls;
}

const defaultControls: CardControls = {
  allowOnline: true,
  allowAtm: true,
  allowContactless: true,
  allowInternational: false,
  dailyLimit: 2500,
  monthlyLimit: 10000,
};

export function issueVirtualCard(userId: string): CardModel {
  const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
  return {
    id: `crd_v_${Date.now()}`,
    userId,
    type: 'virtual',
    brand: 'VISA',
    maskedPan: `•••• •••• •••• ${lastFour}`,
    lastFour,
    exp: '18/90',
    status: 'active',
    controls: { ...defaultControls },
  };
}

export function updateCardStatus(card: CardModel, newStatus: 'active' | 'frozen' | 'terminated'): CardModel {
  return {
    ...card,
    status: newStatus,
  };
}

export function updateCardControls(card: CardModel, newControls: Partial<CardControls>): CardModel {
  return {
    ...card,
    controls: {
      ...card.controls,
      ...newControls,
    },
  };
}
