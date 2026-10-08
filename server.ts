import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { analyzeExpense as localAnalyzeExpense } from './src/utils/expenseAnalyzer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to analyze expense using Gemini
app.post('/api/analyze-expense', async (req, res) => {
  const { input } = req.body;
  const rawInput = typeof input === 'string' ? input.trim() : '';

  if (!rawInput) {
    return res.json({
      isValid: false,
      rawInput,
      error: 'Please enter an expense',
    });
  }

  // Attempt categorization with Gemini API first
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are Student Money Buddy. Analyze the following student input:
"${rawInput}"

Determine:
1. Is this input an expense? An expense MUST contain what was bought/item AND an amount/cost (e.g. "Samosa ₹20", "Movie ticket 250", "Bus ticket 15", "Notebook Rs 50", "Chai 10"). Inputs without prices (e.g. "Hello", "Samosa", "good morning") or without items (e.g. "500", "₹20") are NOT expenses.
2. If it is NOT an expense, return isValid: false and error: "Please enter an expense".
3. If it IS an expense:
   - itemName: clean name of the item or activity WITHOUT the price or currency (e.g. for "Movie ticket 250", itemName is "Movie Ticket"; for "Samosa ₹20", itemName is "Samosa").
   - amount: numerical cost (e.g. 250).
   - currency: currency symbol or code (e.g. "₹", "$", default "₹").
   - category: EXACTLY ONE of: "Food", "Travel", "Study", "Fun", "Other".
     * IMPORTANT: "Movie ticket" is "Fun" (entertainment/movies), NOT Travel!
     * "Food": snacks, chai, coffee, canteen, lunch, dinner, groceries, samosa, pizza.
     * "Travel": bus, metro, train, local, auto rickshaw, cab, fuel, petrol, transit tickets.
     * "Study": books, textbooks, stationery, xerox, printouts, notebooks, courses, pens.
     * "Fun": movies, gaming, concert, parties, outings, streaming subs (Netflix, Spotify), shopping clothes.
     * "Other": room rent, phone recharge, utility bills, laundry, medicine, haircut.
   - savingTip: one short, actionable, friendly saving tip (1-2 sentences) tailored to college students for this specific expense.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert student finance assistant for Student Money Buddy. Always return structured JSON adhering to the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: {
                type: Type.BOOLEAN,
                description: 'True if input has an item and an expense amount.',
              },
              error: {
                type: Type.STRING,
                description: 'Error message, must be "Please enter an expense" if invalid.',
              },
              itemName: {
                type: Type.STRING,
                description: 'Name of the item without the price.',
              },
              amount: {
                type: Type.NUMBER,
                description: 'Numeric price or cost.',
              },
              currency: {
                type: Type.STRING,
                description: 'Currency symbol (default ₹).',
              },
              category: {
                type: Type.STRING,
                description: 'One of Food, Travel, Study, Fun, Other.',
              },
              savingTip: {
                type: Type.STRING,
                description: 'One short saving tip.',
              },
            },
            required: ['isValid'],
          },
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed.isValid) {
          const categoryValid = ['Food', 'Travel', 'Study', 'Fun', 'Other'].includes(parsed.category)
            ? parsed.category
            : 'Other';
          const currency = parsed.currency || '₹';
          const formattedAmount = parsed.amount
            ? `${currency}${Number(parsed.amount).toLocaleString('en-IN')}`
            : undefined;

          return res.json({
            isValid: true,
            rawInput,
            itemName: parsed.itemName,
            amount: parsed.amount,
            formattedAmount,
            currency,
            category: categoryValid,
            savingTip: parsed.savingTip,
            source: 'gemini',
          });
        } else {
          return res.json({
            isValid: false,
            rawInput,
            error: 'Please enter an expense',
            source: 'gemini',
          });
        }
      }
    } catch (err) {
      console.error('Gemini API call failed, using rule-based fallback:', err);
    }
  }

  // Fallback to local rule-based analyzer if API key is absent or request fails
  const localResult = localAnalyzeExpense(rawInput);
  return res.json({
    ...localResult,
    source: 'local',
  });
});

// Mount Vite middlewares in development or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: 3000, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
