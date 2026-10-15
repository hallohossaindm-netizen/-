import { GoogleGenAI } from '@google/genai';

const getGeminiClient = (customKey?: string) => {
  const cleanCustom = typeof customKey === 'string' ? customKey.trim() : '';
  const apiKey = cleanCustom || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
import { GoogleGenAI } from '@google/genai';

const getGeminiClient = (customKey?: string) => {
  const cleanCustom = typeof customKey === 'string' ? customKey.trim() : '';
    const apiKey = cleanCustom || 
        process.env.GEMINI_API_KEY || 
            process.env.VITE_GEMINI_API_KEY;
              if (!apiKey || !apiKey.trim()) return null;
                
                  // সঠিক জেমিনি ক্লায়েন্ট ইনিশিয়ালাইজেশন
                    return new GoogleGenAI({ apiKey: apiKey.trim() });
                    };
                    
                    const SYSTEM_INSTRUCTION = `
                    আপনি "তালিমুল কুরআন মহিলা মাদ্রাসা"-এর অফিসিয়াল ইসলামিক এআই সহকারী—"তালিমুল কুরআন সহকারী" (Talimul Quran Assistant)।
                    পবিত্র কুরআন, সহীহ হাদীস, দৈনন্দিন মাসআলা-মাসায়েল, দুআ-আমল কিংবা আমাদের মাদ্রাসার বিভাগ ও ভর্তি সংক্রান্ত যেকোনো বিষয়ে আপনাকে সাহায্য করতে পারি।
                    `;
                    
                    export default async function handler(req: any, res: any) {
                      // নিশ্চিত করা হচ্ছে যেন সবসময় JSON ফরম্যাটে রেসপন্স যায়
                        res.setHeader('Content-Type', 'application/json');
                        
                          if (req.method !== 'POST') {
                              return res.status(405).json({ error: 'Method Not Allowed' });
                                }
                                
                                  try {
                                      const { message, history, apiKey: bodyApiKey } = req.body || {};
                                          const customKey = (bodyApiKey || req.headers?.['x-gemini-api-key']) as string | undefined;
                                          
                                              if (!message || typeof message !== 'string' || !message.trim()) {
                                                    return res.status(400).json({ error: 'বার্তা প্রদান করুন।' });
                                                        }
                                                        
                                                            const ai = getGeminiClient(customKey);
                                                                if (!ai) {
                                                                      return res.status(500).json({ 
                                                                              error: 'জেমিনি এআই কি কনফিগার করা হয়নি। এনভায়রনমেন্ট ভেরিয়েবলে GEMINI_API_KEY সেট করুন।' 
                                                                                    });
                                                                                        }
                                                                                        
                                                                                            // চ্যাট হিস্ট্রি ফরম্যাট করা
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
                                                                                                                                                            
                                                                                                                                                                // জেমিনি মডেলকে কল করা (gemini-2.5-flash বা উপযোগী মডেল ব্যবহার)
                                                                                                                                                                    const response = await ai.models.generateContent({
                                                                                                                                                                          model: 'gemini-2.5-flash',
                                                                                                                                                                                contents: rawTurns.map(t => ({
                                                                                                                                                                                        role: t.role,
                                                                                                                                                                                                parts: [{ text: t.text }]
                                                                                                                                                                                                      })),
                                                                                                                                                                                                            config: {
                                                                                                                                                                                                                    systemInstruction: SYSTEM_INSTRUCTION,
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                              });
                                                                                                                                                                                                                              
                                                                                                                                                                                                                                  const replyText = response.text || 'দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না।';
                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                      return res.status(200).json({ reply: replyText });
                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                        } catch (error: any) {
                                                                                                                                                                                                                                            console.error('AI Chat Error:', error);
                                                                                                                                                                                                                                                return res.status(500).json({ error: error.message || 'সার্ভারে সমস্যা হয়েছে।' });
                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                  }
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history, apiKey: bodyApiKey } = req.body || {};
    const customKey = (bodyApiKey || req.headers?.['x-gemini-api-key']) as string | undefined;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'বার্তা প্রদান করুন।' });
    }

    const ai = getGeminiClient(customKey);
    if (!ai) {
      return res.status(500).json({
        error: 'জেমিনি এপিআই কি কনফিগার করা হয়নি। Vercel Environment Variables-এ GEMINI_API_KEY সেট করুন।'
      });
    }

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

    while (rawTurns.length > 0 && rawTurns[0].role !== 'user') {
      rawTurns.shift();
    }

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

    return res.status(200).json({ reply });
  } catch (error: any) {
    return res.status(500).json({
      error: 'উত্তর তৈরিতে সাময়িক সমস্যা হয়েছে।',
      details: error?.message || 'Unknown error'
    });
  }
}
