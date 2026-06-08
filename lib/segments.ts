export interface Segment {
  id: number
  label: string
  sublabel: string
  emoji: string
  color: string
  voucherCode: string
}

export const SEGMENTS: Segment[] = [
  { id: 0, label: "15% Off",  sublabel: "Sat & Sun",    emoji: "📅", color: "#db2777", voucherCode: "268CREAMS15"  },
  { id: 1, label: "10% Off",  sublabel: "Mocktails",    emoji: "🍹", color: "#9333ea", voucherCode: "268CREAMS15"  },
  { id: 2, label: "15% Off",  sublabel: "Smoothies",    emoji: "🥤", color: "#ec4899", voucherCode: "268CREAMS15"  },
  { id: 3, label: "10% Off",  sublabel: "Anything",     emoji: "💫", color: "#7c3aed", voucherCode: "268CREAMS10"  },
  // placeholder segments — visual only, never selected by the API
  { id: 4, label: "50% Off",  sublabel: "Everything",   emoji: "🎉", color: "#c026d3", voucherCode: ""             },
  { id: 5, label: "20% Off",  sublabel: "Everything",   emoji: "⭐", color: "#a21caf", voucherCode: ""             },
]

/** Indices that are real rewards and can be selected. */
export const SELECTABLE_SEGMENT_IDS = [0, 1, 2, 3]
