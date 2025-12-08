import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from '../types';

const getClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API Key bulunamadı. Lütfen environment variable'larını kontrol edin.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateBlogContent = async (topic: string): Promise<AIResponse> => {
    const ai = getClient();
    
    // Rıdvan Haliloğlu persona definition for the AI
    const systemContext = `
    Sen Rıdvan Haliloğlu adında, Gümrük Müşaviri, Eğitmen ve Mundoimex Yönetim Kurulu Başkanı olan profesyonel birisin.
    Uzmanlık alanların: Dış ticaret, gümrük mevzuatı, lojistik, dijital dönüşüm ve eğitim.
    Dilin profesyonel, vizyoner, eğitici ama samimi olmalı. Sektör terimlerini yerinde kullanmalısın.
    Yazılarında "Ben" diliyle kişisel tecrübelerine atıfta bulunabilirsin.
    `;

    const prompt = `
    Lütfen aşağıdaki konu hakkında Türkçe bir blog yazısı oluştur.
    Konu: ${topic}
    
    İçerik kuralları:
    1. Başlık ilgi çekici ve profesyonel olsun.
    2. Özet 2-3 cümlelik vurucu bir giriş olsun.
    3. İçerik en az 3 paragraf olsun ve sektörel bir derinlik içersin.
    4. 3-5 adet ilgili etiket üret.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemContext,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Blog yazısının başlığı" },
                        content: { type: Type.STRING, description: "Blog yazısının içeriği" },
                        summary: { type: Type.STRING, description: "Kısa özet" },
                        tags: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Etiketler"
                        }
                    },
                    required: ["title", "content", "summary", "tags"],
                }
            }
        });

        const text = response.text;
        if (!text) {
             throw new Error("AI yanıtı boş döndü.");
        }

        const data = JSON.parse(text) as AIResponse;
        return data;

    } catch (error) {
        console.error("Blog oluşturma hatası:", error);
        throw error;
    }
};