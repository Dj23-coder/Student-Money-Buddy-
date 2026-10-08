export type Category = 'Food' | 'Travel' | 'Study' | 'Fun' | 'Other';

export interface ExpenseAnalysis {
  isValid: boolean;
  rawInput: string;
  itemName?: string;
  amount?: number;
  formattedAmount?: string;
  currency?: string;
  category?: Category;
  savingTip?: string;
  error?: string;
}

// Category keyword maps
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Food: [
    'samosa', 'chai', 'tea', 'coffee', 'latte', 'cappuccino', 'burger', 'pizza',
    'sandwich', 'roll', 'maggi', 'noodles', 'biryani', 'thali', 'dosa', 'idli',
    'vada', 'pav', 'vada pav', 'lunch', 'dinner', 'breakfast', 'snack', 'snacks',
    'canteen', 'mess', 'cafe', 'biscuit', 'biscuits', 'cookie', 'cookies',
    'chips', 'kurkure', 'fries', 'momos', 'ice cream', 'icecream', 'chocolate',
    'drink', 'juice', 'soda', 'coke', 'pepsi', 'shake', 'smoothie', 'water',
    'groceries', 'grocery', 'fruits', 'veggies', 'vegetables', 'milk', 'bread',
    'egg', 'eggs', 'sweets', 'mithai', 'cake', 'pastry', 'shawarma', 'paneer',
    'chicken', 'rice', 'roti', 'dal', 'paratha', 'chaat', 'bhelpuri', 'golgappa',
    'pani puri', 'poha', 'upma', 'kathi roll', 'starbucks', 'mcdonalds', 'kfc',
    'dominos', 'swiggy', 'zomato', 'eat', 'meal', 'dine'
  ],
  Travel: [
    'bus', 'metro', 'train', 'local', 'subway', 'auto', 'rickshaw', 'cab', 'taxi',
    'uber', 'ola', 'rapido', 'bike', 'scooty', 'fuel', 'petrol', 'diesel',
    'gas', 'parking', 'toll', 'fare', 'bus pass', 'metro pass', 'bus ticket',
    'train ticket', 'flight ticket', 'metro ticket', 'rail ticket', 'transit ticket',
    'commute', 'flight', 'airport', 'railway', 'shuttle', 'cycle'
  ],
  Study: [
    'book', 'books', 'textbook', 'notebook', 'register', 'pen', 'pens', 'pencil',
    'eraser', 'sharpener', 'marker', 'highlighter', 'stationery', 'print',
    'printout', 'xerox', 'photocopy', 'scan', 'paper', 'sheet', 'notes',
    'assignment', 'course', 'tuition', 'coaching', 'class', 'exam', 'fee',
    'library', 'binder', 'calculator', 'ruler', 'journal', 'lab', 'project',
    'udemy', 'coursera', 'edx', 'study material', 'textbooks', 'spiral'
  ],
  Fun: [
    'movie ticket', 'cinema ticket', 'theatre ticket', 'concert ticket', 'show ticket',
    'movie', 'cinema', 'theatre', 'film', 'pvr', 'inox', 'popcorn', 'game', 'gaming',
    'steam', 'playstation', 'ps5', 'xbox', 'nintendo', 'netflix', 'prime',
    'spotify', 'hotstar', 'youtube', 'party', 'club', 'pub', 'beer', 'drinks',
    'outing', 'concert', 'match', 'ipl', 'cricket', 'bowling', 'arcade',
    'shopping', 'clothes', 'shirt', 't-shirt', 'jeans', 'dress', 'makeup',
    'shoes', 'sneakers', 'perfume', 'sunglasses', 'trip', 'picnic', 'hangout'
  ],
  Other: [
    'rent', 'hostel', 'pg', 'dorm', 'wifi', 'internet', 'recharge', 'sim',
    'jio', 'airtel', 'vi', 'mobile bill', 'electricity', 'bill', 'laundry',
    'wash', 'barber', 'haircut', 'salon', 'medicine', 'pharmacy', 'doctor',
    'tablet', 'bandage', 'soap', 'shampoo', 'toothpaste', 'brush', 'gym',
    'repair', 'deposit', 'gift', 'misc'
  ],
};

// Item-specific high-impact tips
const SPECIFIC_TIPS: Array<{ keywords: string[]; tip: string; category?: Category }> = [
  {
    keywords: ['samosa', 'snack', 'snacks', 'chips', 'kurkure', 'fries', 'momos', 'biscuit'],
    tip: 'Batch buy snacks in bulk or team up with hostel mates to cut daily tea-time expenses by half.',
  },
  {
    keywords: ['chai', 'tea', 'coffee', 'latte', 'starbucks', 'cafe'],
    tip: 'Carry an insulated travel tumbler and make your own brew before morning lectures.',
  },
  {
    keywords: ['swiggy', 'zomato', 'delivery', 'order'],
    tip: 'Avoid convenience delivery surcharges by doing group orders or walking to nearby food stalls.',
  },
  {
    keywords: ['canteen', 'mess', 'lunch', 'dinner', 'breakfast', 'meal', 'thali'],
    tip: 'Pre-pay for monthly college mess cards rather than paying per-meal rates.',
  },
  {
    keywords: ['bus', 'metro', 'train', 'commute', 'fare', 'transit'],
    tip: 'Grab a student concessional pass or metro smart card for up to 50% discount on regular fares.',
  },
  {
    keywords: ['cab', 'taxi', 'uber', 'ola', 'auto', 'rapido'],
    tip: 'Carpool with batchmates or walk short distances under 15 minutes to save easy cash and stay fit.',
  },
  {
    keywords: ['fuel', 'petrol', 'diesel'],
    tip: 'Keep tire pressures checked and share campus rides with friends to split fuel costs.',
  },
  {
    keywords: ['textbook', 'book', 'books'],
    tip: 'Borrow syllabus books from your campus library or buy second-hand from senior students at 60% off.',
  },
  {
    keywords: ['notebook', 'register', 'pen', 'stationery', 'pencil'],
    tip: 'Purchase stationery in wholesale packs at the start of each semester instead of single retail buys.',
  },
  {
    keywords: ['print', 'printout', 'xerox', 'photocopy'],
    tip: 'Print double-sided in black & white, or utilize free student printing credits at the university lab.',
  },
  {
    keywords: ['movie', 'cinema', 'pvr', 'inox', 'theatre'],
    tip: 'Watch weekday morning shows or flash your college ID card for discounted student movie tickets.',
  },
  {
    keywords: ['netflix', 'prime', 'spotify', 'subscription', 'hotstar', 'youtube'],
    tip: 'Sign up using your college .edu / student email to unlock steep 50% student subscription plans.',
  },
  {
    keywords: ['gaming', 'game', 'steam', 'playstation', 'xbox'],
    tip: 'Wait for seasonal digital sales or swap games with friends instead of paying full launch prices.',
  },
  {
    keywords: ['clothes', 'shopping', 'shoes', 'sneakers', 'shirt', 'dress'],
    tip: 'Use the 48-hour rule: wait two days before non-essential purchases to curb impulsive spending.',
  },
  {
    keywords: ['recharge', 'sim', 'jio', 'airtel', 'mobile bill', 'wifi'],
    tip: 'Choose quarterly recharge packs and leverage campus high-speed Wi-Fi for video downloads.',
  },
  {
    keywords: ['rent', 'pg', 'hostel'],
    tip: 'Share rooms or divide utility and Wi-Fi bills equally among roommates to lower monthly overhead.',
  },
  {
    keywords: ['laundry', 'haircut', 'barber', 'salon'],
    tip: 'Look for local student barbers or opt for weekly wash bundles rather than single-piece laundry.',
  },
];

// Fallback tips per category
const CATEGORY_DEFAULT_TIPS: Record<Category, string[]> = {
  Food: [
    'Cooking simple meals or packing homemade snacks saves ₹1,500+ every month.',
    'Stock up on pocket-friendly staple snacks like bananas, nuts, or biscuits for study sessions.',
    'Keep an eye on daily micro-snacks; those small ₹20-₹40 bites accumulate quickly.',
  ],
  Travel: [
    'Always ask for student transit concessions or buy monthly passes for predictable savings.',
    'Biking or walking short trips around campus saves both transit money and gym memberships.',
    'Coordinate campus departure times with friends to split auto or cab fares.',
  ],
  Study: [
    'Check seniors or college alumni forums for free handed-down books and study notes.',
    'Share digital textbooks and PDF reference guides within your study group.',
    'Take advantage of campus library databases and JSTOR access provided free by your institute.',
  ],
  Fun: [
    'Plan low-cost campus hangouts like picnics, game nights, or hostel movie screenings.',
    'Set a fixed weekly budget for entertainment so you can celebrate guilt-free.',
    'Check if events offer student discounts before paying general admission prices.',
  ],
  Other: [
    'Audit monthly recurring charges and cancel any digital tools you haven\'t used in 30 days.',
    'Compare quarterly prepaid plans for mobile data to lock in the lowest cost per day.',
    'Build a tiny ₹500 emergency buffer fund to prevent panic when unexpected costs crop up.',
  ],
};

/**
 * Main parser and analyzer
 */
export function analyzeExpense(input: string): ExpenseAnalysis {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      rawInput: input,
      error: 'Please enter an expense',
    };
  }

  // Regex to detect price/amount
  // Matches:
  // ₹20, $15, 20rs, 20 rs, 20 inr, Rs. 20, 20/-, 20 rupees, 20.50, etc.
  const priceRegexPatterns = [
    // Symbol before number: ₹ 20, $15, Rs. 20, Rs 20
    /(?:₹|rs\.?|inr|\$|€|£|¥)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/i,
    // Number followed by symbol/currency: 20 ₹, 20rs, 20 inr, 20/-, 20 rupees, 20 bucks
    /(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:₹|rs\.?|inr|\$|€|£|¥|\/-|rupees?|bucks?)/i,
    // Standalone number that looks like a price at the beginning or end of input
    /(?:^|\s)(\d+(?:,\d+)*(?:\.\d{1,2})?)(?:\s|$)/,
  ];

  let matchedAmountStr: string | null = null;
  let matchedFullPriceText: string | null = null;
  let detectedCurrency = '₹';

  // Check currency cues
  if (/\$|dollars?/i.test(trimmed)) detectedCurrency = '$';
  else if (/€|euros?/i.test(trimmed)) detectedCurrency = '€';
  else if (/£|pounds?/i.test(trimmed)) detectedCurrency = '£';
  else if (/¥|yen/i.test(trimmed)) detectedCurrency = '¥';
  else if (/₹|rs|inr|rupees/i.test(trimmed)) detectedCurrency = '₹';

  // Find the price match
  // 1. Try explicit currency patterns first
  let match = trimmed.match(/(?:₹|rs\.?|inr|\$|€|£|¥)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/i);
  if (match) {
    matchedFullPriceText = match[0];
    matchedAmountStr = match[1];
  } else {
    match = trimmed.match(/(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:₹|rs\.?|inr|\$|€|£|¥|\/-|rupees?|bucks?)/i);
    if (match) {
      matchedFullPriceText = match[0];
      matchedAmountStr = match[1];
    } else {
      // 3. Look for standalone numbers
      const numMatches = Array.from(trimmed.matchAll(/(?:^|\s)(\d+(?:,\d+)*(?:\.\d{1,2})?)(?:\s|$)/g));
      if (numMatches.length > 0) {
        // Prefer the last number (e.g. "Samosa 20")
        const lastMatch = numMatches[numMatches.length - 1];
        matchedFullPriceText = lastMatch[1];
        matchedAmountStr = lastMatch[1];
      }
    }
  }

  // If no numerical price was found, this is not an expense!
  if (!matchedAmountStr || !matchedFullPriceText) {
    return {
      isValid: false,
      rawInput: input,
      error: 'Please enter an expense',
    };
  }

  const numericAmount = parseFloat(matchedAmountStr.replace(/,/g, ''));
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return {
      isValid: false,
      rawInput: input,
      error: 'Please enter an expense',
    };
  }

  // Remove the price text from input to extract the item name
  // Replace the matched price substring
  let itemRaw = trimmed.replace(matchedFullPriceText, ' ');

  // Clean common conjunctions and prepositions: "for", "at", "worth", "bought", "spent on", "costs", "cost", "paid"
  itemRaw = itemRaw
    .replace(/\b(spent\s+on|bought|for|at|worth|costs|cost|paid|to|of)\b/gi, ' ')
    .replace(/[₹$€£¥]/g, ' ')
    .replace(/\b(rs|inr|rupees?|bucks?)\b/gi, ' ')
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If no item name left, or item is too short / purely punctuation
  if (!itemRaw || itemRaw.length < 2 || !/[a-zA-Z]/.test(itemRaw)) {
    return {
      isValid: false,
      rawInput: input,
      error: 'Please enter an expense',
    };
  }

  // Format cleaned item name (Title Case)
  const itemName = formatItemName(itemRaw);

  // Categorize
  const category = determineCategory(itemName, trimmed);

  // Pick tip
  const savingTip = selectSavingTip(itemName, category);

  return {
    isValid: true,
    rawInput: input,
    itemName,
    amount: numericAmount,
    formattedAmount: `${detectedCurrency}${numericAmount.toLocaleString('en-IN')}`,
    currency: detectedCurrency,
    category,
    savingTip,
  };
}

function formatItemName(str: string): string {
  return str
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function determineCategory(itemName: string, fullInput: string): Category {
  const combined = `${itemName} ${fullInput}`.toLowerCase();

  // Score each category based on keyword matches
  const scores: Record<Category, number> = {
    Food: 0,
    Travel: 0,
    Study: 0,
    Fun: 0,
    Other: 0,
  };

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
      if (regex.test(combined)) {
        scores[cat] += kw.length > 4 ? 3 : 2;
      } else if (combined.includes(kw.toLowerCase())) {
        scores[cat] += 1;
      }
    }
  }

  // Find max category
  let bestCategory: Category = 'Other';
  let highestScore = 0;

  for (const [cat, score] of Object.entries(scores) as [Category, number][]) {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = cat;
    }
  }

  return bestCategory;
}

function selectSavingTip(itemName: string, category: Category): string {
  const lowerItem = itemName.toLowerCase();

  // 1. Look for specific tips
  for (const item of SPECIFIC_TIPS) {
    for (const kw of item.keywords) {
      if (lowerItem.includes(kw.toLowerCase())) {
        return item.tip;
      }
    }
  }

  // 2. Fallback category tip
  const tips = CATEGORY_DEFAULT_TIPS[category];
  // Deterministic pick based on item name characters to stay consistent for the same item
  let hash = 0;
  for (let i = 0; i < itemName.length; i++) {
    hash = (hash << 5) - hash + itemName.charCodeAt(i);
  }
  const index = Math.abs(hash) % tips.length;
  return tips[index];
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
