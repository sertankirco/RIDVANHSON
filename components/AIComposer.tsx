import React, { useState } from 'react';
import { generateBlogContent } from '../services/geminiService';
import { BlogPost } from '../types';
import { Button } from './Button';
import { Sparkles, X } from 'lucide-react';

interface AIComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: BlogPost) => void;
}

export const AIComposer: React.FC<AIComposerProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const aiData = await generateBlogContent(topic);
      
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: aiData.title,
        content: aiData.content,
        summary: aiData.summary,
        tags: aiData.tags,
        author: 'Rıdvan Haliloğlu', // Changed author to the site owner
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        imageUrl: `https://picsum.photos/800/600?random=${Date.now()}`
      };

      onPostCreated(newPost);
      setTopic('');
      onClose();
    } catch (err) {
      setError('İçerik oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-scaleIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">AI Asistan ile Yaz</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Blogunuz için profesyonel bir taslak oluşturun. Konuyu belirtmeniz yeterli.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Blog Konusu
            </label>
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Örn: 2024 Lojistik trendleri ve Türkiye'nin konumu..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px] resize-none text-slate-800 placeholder-slate-400 shadow-sm"
              disabled={isGenerating}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={onClose}
              disabled={isGenerating}
            >
              Vazgeç
            </Button>
            <Button 
              className="flex-1 !bg-blue-600 hover:!bg-blue-700"
              onClick={handleGenerate}
              isLoading={isGenerating}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Taslak Oluştur
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};