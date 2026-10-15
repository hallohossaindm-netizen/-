import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Universal CORS & iframe headers at the very top
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-api-key');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.removeHeader('X-Frame-Options');
  next();
});

app.options('*', (_req, res) => {
  res.sendStatus(200);
});

app.use(express.json());

// Initialize GoogleGenAI SDK
// Helper to get GoogleGenAI client with available API key
const getGeminiClient = (customKey?: string) => {
  const cleanCustom = typeof customKey === 'string' ? customKey.trim() : '';
  const apiKey = cleanCustom || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const SYSTEM_INSTRUCTION = `
আপনি "তালিমুল কুরআন মহিলা মাদ্রাসা"-এর অফিশিয়াল ইসলামিক এআই সহকারী—"তালিমুল কুরআন সহকারী" (Talimul Quran Assistant)।

আপনার মূল দায়িত্ব ও উদ্দেশ্য:
শিক্ষার্থী (তালিবাত), অভিভাবক এবং সাধারণ দর্শনার্থীদের কুরআন, হাদিস, দৈনন্দিন প্রয়োজনীয় ইসলামিক মাসআলা-মাসায়েল, আমল এবং তালিমুল কুরআন মহিলা মাদ্রাসা সংক্রান্ত যাবতীয় তথ্যের সঠিক উত্তর দিয়ে সাহায্য করা।

উৎস ও ভিত্তি:
- কুরআনুল কারীম
- সহীহ ও গ্রহণযোগ্য হাদীসগ্রন্থ (বুখারী, মুসলিম, তিরমিযী, আবু দাউদ, নাসাঈ, ইবনে মাজাহ)
- নির্ভরযোগ্য ফিকহে হানাফী এবং আহলুস সুন্নাহ ওয়াল জামাআতের মূলধারার আলেমদের মতামতের ওপর সম্পূর্ণ ভিত্তি করে উত্তর প্রদান করবেন।

আচরণ ও নীতিমালার নির্দেশিকা:
১. সম্মান ও ভাষা: সর্বদা অত্যন্ত বিনম্র, মার্জিত, স্নেহশীল এবং বিজ্ঞ আলেমসুলভ শ্রদ্ধাশীল ভাষায় কথা বলবেন। কথোপকথনের শুরুতে সালাম (যেমন: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ") দিয়ে অভিবাদন জানাবেন। উত্তরসমূহ সর্বদা প্রমিত, শুদ্ধ ও সুন্দর বাংলায় প্রদান করবেন। প্রয়োজনে প্রাসঙ্গিক কোরআনের আয়াত বা হাদিসের সুন্দর বাংলা অনুবাদ এবং রেফারেন্স উল্লেখ করবেন।
২. ফতোয়া ও জটিল মাসআলা সংক্রান্ত সতর্কতা: কোনো জটিল ফিকহি বিরোধ, তালাক/মিরাস বা গভীর ফতোয়া বিষয়ক প্রশ্ন আসলে সাধারণ সিদ্ধান্ত এড়িয়ে চলবেন এবং বলবেন: "এটি একটি জটিল ফতোয়া সংক্রান্ত বিষয়, সঠিক ও সুনির্দিষ্ট সিদ্ধান্তের জন্য আমাদের মাদ্রাসার দারুল ইফতা বা একজন বিজ্ঞ মুফতি সাহেবের সাথে সরাসরি যোগাযোগ করার পরামর্শ দেওয়া হলো।"
৩. মাদ্রাসার তথ্য নির্দেশিকা:
- নাম: তালিমুল কুরআন মহিলা মাদ্রাসা (Talimul Quran Women's Madrasah)
- অবস্থান: জামিয়া রোড, ব্লক-ডি, রূপনগর, মিরপুর, ঢাকা-১২১৬
- যোগাযোগের নম্বর: +৮৮০ ১৭১২-৩৪৫৬৭৮, +৮৮০ ১৮১৯-৯৮৭৬৫৪
- ইমেইল: info@talimulquran-madrasah.edu.bd
- বিভাগসমূহ:
  ১) মক্তব ও নূরানী বিভাগ (প্রাথমিক আরবী, কায়েদা, মাসনুন দোয়া ও বুনিয়াদী সাধারণ শিক্ষা)
  ২) নাজেরা বিভাগ (বিশুদ্ধ তাজবীদ ও মাখরাজ সহকারে কুরআন তিলাওয়াত প্রশিক্ষণ)
  ৩) হিফজুল কুরআন বিভাগ (আন্তর্জাতিক মানসম্পন্ন পূর্ণাঙ্গ ৩০ পারা হিফজ ও হুসনুত তিলাওয়াত)
  ৪) কিতাব বিভাগ (মিজান থেকে দাওরায়ে হাদীস - মাস্টার্স সমমান পর্যন্ত শরীয়াহ শিক্ষা)
- বৈশিষ্ট্য: সম্পূর্ণ অভিজ্ঞ নারী শিক্ষিকা ও হাফেযাদের দ্বারা পাঠদান, শতভাগ শরয়ী পর্দা, নিরাপদ সুসজ্জিত আবাসিক হোস্টেল, পুষ্টিকর খাবার, বেফাকুল মাদারিসিল আরাবিয়া অধিভুক্ত।
- ভর্তি: অনলাইন ফরম পূরণ করে অথবা মাদ্রাসা অফিসে উপস্থিত হয়ে আবেদন করা যায়।
৪. কঠোর সীমারেখা (Boundaries):
- রাজনৈতিক বা দলাদলি সংক্রান্ত কোনো প্রশ্নের উত্তর দিবেন না।
- ফিরক্বাভিত্তিক বা ফেরকাবাজিমূলক কোনো বিতর্কে জড়াবেন না।
- কোনো অপ্রমাণিত বা ভিত্তিহীন ইসরাঈলী রেওয়াত বা দুর্বল ভিত্তিহীন কিচ্ছা-কাহিনী পরিহার করবেন।
- সর্বদা বিশুদ্ধ ইসলাম, চরিত্র গঠন, তাকওয়া ও নৈতিক শিক্ষার আলো ছড়িয়ে দেবেন।
`;

// AI Assistant Chat API Route
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, history, apiKey: bodyApiKey } = req.body;
    const customKey = (bodyApiKey || req.headers['x-gemini-api-key']) as string | undefined;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'বার্তা প্রদান করুন।' });
    }

    const ai = getGeminiClient(customKey);
    if (!ai) {
      return res.status(500).json({
        error: 'জেমিনি এপিআই কি কনফিগার করা হয়নি। অনুগ্রহ করে .env ফাইল বা সেটিংস থেকে নিশ্চিত করুন।'
      });
    }

    // Clean & normalize conversational turns
    const rawTurns: Array<{ role: 'user' | 'model'; text: string }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item && typeof item.text === 'string' && item.text.trim()) {
          const role = item.role === 'model' ? 'model' : 'user';
          rawTurns.push({ role, text: item.text.trim() });
        }
      }
    }
    rawTurns.push({ role: 'user', text: message.trim() });

    // The first turn in Gemini API must always be from 'user'
    while (rawTurns.length > 0 && rawTurns[0].role !== 'user') {
      rawTurns.shift();
    }

    // Merge consecutive turns with identical roles so strict alternating constraints are met
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const turn of rawTurns) {
      if (contents.length > 0 && contents[contents.length - 1].role === turn.role) {
        contents[contents.length - 1].parts[0].text += `\n${turn.text}`;
      } else {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.text }],
        });
      }
    }

    let reply = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
        },
      });
      reply = response.text || '';
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-3.8-flash error, falling back to gemini-3.1-flash-lite:', primaryErr?.message);
      // Fallback model for resilience against temporary demand spikes
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
        },
      });
      reply = fallbackResponse.text || '';
    }

    if (!reply) {
      reply = 'দুঃখিত, কোনো উত্তর প্রস্তুত করা যায়নি। অনুগ্রহ করে আবার প্রশ্নটি করুন।';
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini Assistant Error:', error);
    res.status(500).json({
      error: 'উত্তর তৈরিতে সাময়িক সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
      details: error?.message || 'Unknown error'
    });
  }
});



async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  const portNumber = Number(PORT);
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${portNumber}`);
  });
}

startServer();
