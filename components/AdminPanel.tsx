import React, { useState } from 'react';
import { BlogPost, SiteContent } from '../types';
import { Button } from './Button';
import { generateBlogContent } from '../services/geminiService';
import { getValidImageUrl } from '../utils/image';
import { 
  LayoutDashboard, 
  FileText, 
  PenTool, 
  LogOut, 
  Globe, 
  Trash2, 
  Sparkles,
  Plus,
  Search,
  Eye,
  TrendingUp,
  Settings,
  Save
} from 'lucide-react';

interface AdminPanelProps {
  posts: BlogPost[];
  setPosts: (posts: BlogPost[]) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
  onLogout: () => void;
  onViewSite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  posts, 
  setPosts, 
  siteContent,
  onUpdateSiteContent,
  onLogout, 
  onViewSite 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'new' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // New Post State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSummary, setNewPostSummary] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  // Settings State (Local state for editing before saving)
  const [editContent, setEditContent] = useState<SiteContent>(siteContent);

  const handleDelete = (id: string) => {
    if (confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      summary: newPostSummary,
      tags: ['Genel'],
      author: siteContent.personal.name,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      imageUrl: newPostImage || `https://picsum.photos/800/600?random=${Date.now()}`
    };
    setPosts([newPost, ...posts]);
    alert('Yazı başarıyla yayınlandı!');
    setActiveTab('posts');
    resetForm();
  };

  const handleAIGenerate = async () => {
    if (!aiTopic) return;
    setAiLoading(true);
    try {
      const aiData = await generateBlogContent(aiTopic);
      setNewPostTitle(aiData.title);
      setNewPostContent(aiData.content);
      setNewPostSummary(aiData.summary);
      setAiTopic('');
    } catch (error) {
      alert('AI içeriği oluşturulamadı.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteContent(editContent);
    alert('Site ayarları başarıyla güncellendi!');
  };

  const resetForm = () => {
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostSummary('');
    setNewPostImage('');
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">A</div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Genel Bakış
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'posts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            Yazılar
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'new' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <PenTool className="w-5 h-5" />
            Yeni Yazı Ekle
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
            Site Ayarları
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button onClick={onViewSite} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <Globe className="w-5 h-5" />
            Siteyi Görüntüle
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <h1 className="text-3xl font-bold text-slate-900">Hoşgeldiniz, {siteContent.personal.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 text-sm font-medium">Toplam Yazı</h3>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{posts.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 text-sm font-medium">Toplam Görüntülenme</h3>
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">12.5K</p>
                <span className="text-xs text-green-600 font-medium flex items-center mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" /> %12 artış
                </span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 text-sm font-medium">Site Durumu</h3>
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-lg font-bold text-slate-900">Yayında</p>
                <p className="text-xs text-slate-400 mt-2">Son güncelleme: Bugün</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Son Eklenen Yazılar</h2>
              <div className="space-y-4">
                {posts.slice(0, 3).map(post => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={getValidImageUrl(post.imageUrl)} alt="" className="w-12 h-12 rounded object-cover" />
                      <div>
                        <h4 className="font-medium text-slate-900">{post.title}</h4>
                        <p className="text-sm text-slate-500">{post.date}</p>
                      </div>
                    </div>
                    <Button variant="secondary" onClick={() => setActiveTab('posts')} className="text-sm">Yönet</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Yazı Yönetimi</h1>
              <Button onClick={() => setActiveTab('new')} icon={<Plus className="w-4 h-4" />}>Yeni Ekle</Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Yazı ara..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-slate-600">Görsel</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Başlık</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Tarih</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map(post => (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 w-20">
                        <img src={getValidImageUrl(post.imageUrl)} alt="" className="w-12 h-12 rounded object-cover" />
                      </td>
                      <td className="p-4 font-medium text-slate-900">{post.title}</td>
                      <td className="p-4 text-slate-500 text-sm">{post.date}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">Yazı bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'new' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900">Yeni Yazı Ekle</h1>

            {/* AI Assistant Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">AI Asistan ile Taslak Oluştur</h3>
                  <p className="text-sm text-slate-600 mb-4">Bir konu başlığı girin, yapay zeka sizin için başlık, özet ve içeriği oluştursun.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="Örn: 2024 Lojistik Trendleri..."
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button onClick={handleAIGenerate} isLoading={aiLoading} icon={<Sparkles className="w-4 h-4" />}>
                      Oluştur
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Yazı Başlığı</label>
                <input 
                  required
                  type="text" 
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Görsel URL</label>
                <input 
                  type="text" 
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-400 mt-1">Boş bırakılırsa rastgele görsel atanır.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kısa Özet</label>
                <textarea 
                  required
                  value={newPostSummary}
                  onChange={(e) => setNewPostSummary(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İçerik</label>
                <textarea 
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => setActiveTab('posts')}>İptal</Button>
                <Button type="submit">Yazıyı Yayınla</Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Site Ayarları</h1>
              <Button onClick={handleSaveSettings} icon={<Save className="w-4 h-4" />}>
                Kaydet
              </Button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* Personal Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Kişisel Bilgiler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad (Site Başlığı)</label>
                    <input 
                      type="text" 
                      value={editContent.personal.name}
                      onChange={(e) => setEditContent({...editContent, personal: {...editContent.personal, name: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unvan</label>
                    <input 
                      type="text" 
                      value={editContent.personal.title}
                      onChange={(e) => setEditContent({...editContent, personal: {...editContent.personal, title: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Ana Sayfa (Hero) Alanı</h2>
                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Profil Resmi URL</label>
                    <input 
                      type="text" 
                      value={editContent.hero.imageUrl}
                      onChange={(e) => setEditContent({...editContent, hero: {...editContent.hero, imageUrl: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Üst Rozet Yazısı</label>
                    <input 
                      type="text" 
                      value={editContent.hero.badge}
                      onChange={(e) => setEditContent({...editContent, hero: {...editContent.hero, badge: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Slogan 1. Satır</label>
                      <input 
                        type="text" 
                        value={editContent.hero.titleLine1}
                        onChange={(e) => setEditContent({...editContent, hero: {...editContent.hero, titleLine1: e.target.value}})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Slogan Vurgulu Kısım (Renkli)</label>
                      <input 
                        type="text" 
                        value={editContent.hero.titleHighlight}
                        onChange={(e) => setEditContent({...editContent, hero: {...editContent.hero, titleHighlight: e.target.value}})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama Metni</label>
                    <textarea 
                      rows={3}
                      value={editContent.hero.description}
                      onChange={(e) => setEditContent({...editContent, hero: {...editContent.hero, description: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tecrübe Yılı (Rozet)</label>
                    <input 
                      type="text" 
                      value={editContent.hero.experienceYears}
                      onChange={(e) => setEditContent({...editContent, hero: {...editContent.hero, experienceYears: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Hakkımda Alanı</h2>
                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bölüm Başlığı</label>
                    <input 
                      type="text" 
                      value={editContent.about.title}
                      onChange={(e) => setEditContent({...editContent, about: {...editContent.about, title: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Paragraf 1</label>
                    <textarea 
                      rows={4}
                      value={editContent.about.paragraph1}
                      onChange={(e) => setEditContent({...editContent, about: {...editContent.about, paragraph1: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Paragraf 2</label>
                    <textarea 
                      rows={4}
                      value={editContent.about.paragraph2}
                      onChange={(e) => setEditContent({...editContent, about: {...editContent.about, paragraph2: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>
        )}
      </main>
    </div>
  );
};