
import React, { useState } from 'react';
import { BlogPost, SiteContent, Video, Experience } from '../types';
import { Button } from './Button';
import { generateBlogContent } from '../services/geminiService';
import { getValidImageUrl } from '../utils/image';
import { getYoutubeThumbnail } from '../utils/video';
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
  Save,
  Code,
  Copy,
  Check,
  Github,
  Edit,
  Play,
  Briefcase,
  XCircle,
  ArrowUp,
  ArrowDown
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'new' | 'videos' | 'experience' | 'settings' | 'export'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Post Form State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSummary, setNewPostSummary] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  
  // Video Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDesc, setVideoDesc] = useState('');

  // Experience Form State
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  // Settings State (Local state for editing before saving)
  const [editContent, setEditContent] = useState<SiteContent>(siteContent);

  // Export State
  const [copied, setCopied] = useState(false);

  // --- Reset Forms ---
  const resetForm = () => {
    setEditingId(null);
    // Post fields
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostSummary('');
    setNewPostImage('');
    // Video fields
    setVideoTitle('');
    setVideoUrl('');
    setVideoDesc('');
    // Experience fields
    setExpCompany('');
    setExpRole('');
    setExpPeriod('');
    setExpDesc('');
  };

  // --- Post Functions ---
  const handleDelete = (id: string) => {
    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
    }
  };

  const handleEdit = (post: BlogPost) => {
    resetForm();
    setEditingId(post.id);
    setNewPostTitle(post.title);
    setNewPostContent(post.content);
    setNewPostSummary(post.summary);
    setNewPostImage(post.imageUrl);
    setActiveTab('new');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing post
      const updatedPosts = posts.map(post => {
        if (post.id === editingId) {
          return {
            ...post,
            title: newPostTitle,
            content: newPostContent,
            summary: newPostSummary,
            imageUrl: newPostImage || post.imageUrl
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      alert('Yazı başarıyla güncellendi!');
    } else {
      // Create new post
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
    }
    
    setActiveTab('posts');
    resetForm();
  };

  // --- Video Functions ---
  const handleAddVideo = (e: React.FormEvent) => {
     e.preventDefault();
     const newVideo: Video = {
       id: Date.now().toString(),
       title: videoTitle,
       url: videoUrl,
       description: videoDesc
     };
     
     const currentVideos = siteContent.videos || [];
     const updatedContent = { ...siteContent, videos: [...currentVideos, newVideo] };
     
     onUpdateSiteContent(updatedContent);
     setEditContent(updatedContent);
     
     resetForm();
     alert('Video eklendi!');
  };

  const handleDeleteVideo = (id: string) => {
     if (window.confirm('Bu videoyu silmek istediğinize emin misiniz?')) {
        const currentVideos = siteContent.videos || [];
        const updatedVideos = currentVideos.filter(v => v.id !== id);
        const updatedContent = { ...siteContent, videos: updatedVideos };
        onUpdateSiteContent(updatedContent);
        setEditContent(updatedContent);
     }
  };

  // --- Experience Functions ---
  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
        // UPDATE Logic
        const updatedExpList = (siteContent.experience || []).map(exp => 
            exp.id === editingId 
            ? { ...exp, company: expCompany, role: expRole, period: expPeriod, description: expDesc }
            : exp
        );
        const updatedContent = { ...siteContent, experience: updatedExpList };
        onUpdateSiteContent(updatedContent);
        setEditContent(updatedContent);
        alert('Deneyim başarıyla güncellendi!');
    } else {
        // ADD Logic
        const newExp: Experience = {
            id: Date.now().toString(),
            company: expCompany,
            role: expRole,
            period: expPeriod,
            description: expDesc
        };
        const currentExp = siteContent.experience || [];
        const updatedContent = { ...siteContent, experience: [newExp, ...currentExp] };
        onUpdateSiteContent(updatedContent);
        setEditContent(updatedContent);
        alert('Deneyim eklendi!');
    }
    resetForm();
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingId(exp.id);
    setExpCompany(exp.company);
    setExpRole(exp.role);
    setExpPeriod(exp.period);
    setExpDesc(exp.description);
    // Scroll to form
    const formElement = document.getElementById('experience-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteExperience = (id: string) => {
    if (window.confirm('Bu deneyimi silmek istediğinize emin misiniz?')) {
       const currentExp = siteContent.experience || [];
       const updatedExp = currentExp.filter(e => e.id !== id);
       const updatedContent = { ...siteContent, experience: updatedExp };
       onUpdateSiteContent(updatedContent);
       setEditContent(updatedContent);
       
       // If deleting the currently editing item, reset form
       if (editingId === id) resetForm();
    }
 };

 const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    const currentExp = [...(siteContent.experience || [])];
    
    if (direction === 'up') {
        if (index === 0) return; // Zaten en üstte
        // Swap with previous
        [currentExp[index], currentExp[index - 1]] = [currentExp[index - 1], currentExp[index]];
    } else {
        if (index === currentExp.length - 1) return; // Zaten en altta
        // Swap with next
        [currentExp[index], currentExp[index + 1]] = [currentExp[index + 1], currentExp[index]];
    }

    const updatedContent = { ...siteContent, experience: currentExp };
    onUpdateSiteContent(updatedContent);
    setEditContent(updatedContent);
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

  const generateExportCode = () => {
    return `import { BlogPost, SiteContent } from './types';

export const INITIAL_SITE_CONTENT: SiteContent = ${JSON.stringify(siteContent, null, 2)};

export const INITIAL_POSTS: BlogPost[] = ${JSON.stringify(posts, null, 2)};`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            onClick={() => { setActiveTab('dashboard'); resetForm(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Genel Bakış
          </button>
          <button 
            onClick={() => { setActiveTab('posts'); resetForm(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'posts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            Yazılar
          </button>
          <button 
            onClick={() => { setActiveTab('new'); resetForm(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'new' && !editingId ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <PenTool className="w-5 h-5" />
            Yeni Yazı Ekle
          </button>
          <button 
            onClick={() => { setActiveTab('videos'); resetForm(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'videos' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Play className="w-5 h-5" />
            Videolar
          </button>
          <button 
            onClick={() => { setActiveTab('experience'); resetForm(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'experience' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Briefcase className="w-5 h-5" />
            Kariyer
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); resetForm(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
            Site Ayarları
          </button>
          <button 
            onClick={() => { setActiveTab('export'); resetForm(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'export' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-purple-900 hover:text-white'}`}
          >
            <Code className="w-5 h-5" />
            Kod Üret / Yayınla
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
                  <h3 className="text-slate-500 text-sm font-medium">Toplam Video</h3>
                  <Play className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{(siteContent.videos || []).length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 text-sm font-medium">Kariyer Kaydı</h3>
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{(siteContent.experience || []).length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Son Eklenen Yazılar</h2>
              <div className="space-y-4">
                {posts.slice(0, 3).map(post => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img 
                        src={getValidImageUrl(post.imageUrl)} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded object-cover" 
                      />
                      <div>
                        <h4 className="font-medium text-slate-900">{post.title}</h4>
                        <p className="text-sm text-slate-500">{post.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
             <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Video Yönetimi</h1>
            </div>
            
            {/* Add New Video Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 mb-4">Yeni Video Ekle</h3>
               <form onSubmit={handleAddVideo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Video Başlığı</label>
                    <input 
                      required
                      type="text" 
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: Sektör Değerlendirmesi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">YouTube Linki</label>
                    <input 
                      required
                      type="text" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kısa Açıklama</label>
                    <input 
                      type="text" 
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Videonun içeriği hakkında kısa bilgi..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" icon={<Plus className="w-4 h-4" />}>Ekle</Button>
                  </div>
               </form>
            </div>

            {/* Existing Videos List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 mb-4">Mevcut Videolar</h3>
               <div className="space-y-4">
                  {(siteContent.videos && siteContent.videos.length > 0) ? (
                    siteContent.videos.map(video => (
                      <div key={video.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                         <div className="w-24 h-16 shrink-0 rounded overflow-hidden relative bg-black">
                            <img src={getYoutubeThumbnail(video.url)} alt="" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Play className="w-6 h-6 text-white" />
                            </div>
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-slate-900">{video.title}</h4>
                            <p className="text-sm text-slate-500 truncate">{video.url}</p>
                         </div>
                         <button 
                            onClick={() => handleDeleteVideo(video.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                         >
                            <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">Henüz video eklenmemiş.</p>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
             <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Profesyonel Yolculuk Yönetimi</h1>
            </div>
            
            {/* Add/Edit Experience Form */}
            <div id="experience-form" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 mb-4">
                 {editingId ? 'Deneyim Düzenle' : 'Yeni Deneyim Ekle'}
               </h3>
               <form onSubmit={handleExperienceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Şirket / Kurum</label>
                      <input 
                        required
                        type="text" 
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: Mundoimex"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Dönem</label>
                      <input 
                        required
                        type="text" 
                        value={expPeriod}
                        onChange={(e) => setExpPeriod(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: 2016 - Günümüz"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pozisyon / Unvan</label>
                    <input 
                      required
                      type="text" 
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: Yönetim Kurulu Başkanı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                    <input 
                      required
                      type="text" 
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kısa görev tanımı..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    {editingId && (
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={resetForm}
                        icon={<XCircle className="w-4 h-4" />}
                      >
                        Vazgeç
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      icon={editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    >
                      {editingId ? 'Güncelle' : 'Ekle'}
                    </Button>
                  </div>
               </form>
            </div>

            {/* Existing Experience List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 mb-4">Mevcut Deneyimler</h3>
               <div className="space-y-4">
                  {(siteContent.experience && siteContent.experience.length > 0) ? (
                    siteContent.experience.map((exp, index) => (
                      <div key={exp.id} className={`flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 ${editingId === exp.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                         
                         {/* Ordering Buttons */}
                         <div className="flex flex-col gap-1 pr-2 border-r border-slate-200">
                             <button 
                                onClick={() => handleMoveExperience(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Yukarı Taşı"
                             >
                                <ArrowUp className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => handleMoveExperience(index, 'down')}
                                disabled={index === (siteContent.experience?.length || 0) - 1}
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Aşağı Taşı"
                             >
                                <ArrowDown className="w-4 h-4" />
                             </button>
                         </div>

                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                            <Briefcase className="w-5 h-5 text-slate-500" />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-900">{exp.company}</h4>
                              <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">{exp.period}</span>
                            </div>
                            <p className="text-blue-600 font-medium text-sm">{exp.role}</p>
                            <p className="text-slate-500 text-sm mt-1">{exp.description}</p>
                         </div>
                         <div className="flex gap-2">
                           <button 
                              onClick={() => handleEditExperience(exp)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Düzenle"
                           >
                              <Edit className="w-5 h-5" />
                           </button>
                           <button 
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Sil"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                         </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">Henüz deneyim eklenmemiş.</p>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Yazı Yönetimi</h1>
              <Button onClick={() => { resetForm(); setActiveTab('new'); }} icon={<Plus className="w-4 h-4" />}>Yeni Ekle</Button>
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
                        <img 
                          src={getValidImageUrl(post.imageUrl)} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded object-cover" 
                        />
                      </td>
                      <td className="p-4 font-medium text-slate-900">{post.title}</td>
                      <td className="p-4 text-slate-500 text-sm">{post.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                            onClick={() => handleEdit(post)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
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
            <h1 className="text-2xl font-bold text-slate-900">
              {editingId ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
            </h1>

            {/* AI Assistant Section - Only show for new posts to avoid overwriting edits */}
            {!editingId && (
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
            )}

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
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => { setActiveTab('posts'); resetForm(); }}
                >
                  İptal
                </Button>
                <Button type="submit">
                  {editingId ? 'Güncelle' : 'Yazıyı Yayınla'}
                </Button>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kısa Özet (Ana Sayfa İçin)</label>
                    <textarea 
                      rows={4}
                      value={editContent.about.shortSummary}
                      onChange={(e) => setEditContent({...editContent, about: {...editContent.about, shortSummary: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Detaylı Biyografi (Pencerede Açılan)</label>
                    <textarea 
                      rows={12}
                      value={editContent.about.fullBiography}
                      onChange={(e) => setEditContent({...editContent, about: {...editContent.about, fullBiography: e.target.value}})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>
        )}

        {activeTab === 'export' && (
           <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
             <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-8">
               <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
                 <Code className="w-6 h-6 mr-2" /> Değişiklikleri Kalıcı Hale Getirme
               </h2>
               <p className="text-purple-800 mb-4">
                 Sitenizi Vercel veya GitHub üzerinde güncellediğinizde değişikliklerin (yeni yazılar, ayarlar, videolar vb.) kalıcı olması için aşağıdaki kodu 
                 <strong> constants.ts</strong> dosyasına yapıştırmalısınız.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-900 mt-4">
                 <div className="bg-white p-4 rounded-lg border border-purple-100">
                   <h3 className="font-bold mb-2 flex items-center"><Github className="w-4 h-4 mr-2"/> GitHub Sitesi Üzerinden</h3>
                   <ol className="list-decimal list-inside space-y-1">
                     <li>Kodu kopyalayın.</li>
                     <li>GitHub'da projenizi açın.</li>
                     <li><strong>constants.ts</strong> dosyasına gidin.</li>
                     <li>Kalem ikonuna (Edit) basın.</li>
                     <li>Eski içeriği silip yeni kodu yapıştırın.</li>
                     <li>"Commit changes" butonuna basın.</li>
                   </ol>
                 </div>
                 <div className="bg-white p-4 rounded-lg border border-purple-100">
                   <h3 className="font-bold mb-2 flex items-center"><Code className="w-4 h-4 mr-2"/> VS Code (Bilgisayar) Üzerinden</h3>
                   <ol className="list-decimal list-inside space-y-1">
                     <li>Kodu kopyalayın.</li>
                     <li>Proje klasöründeki <strong>constants.ts</strong> dosyasını açın.</li>
                     <li>İçeriği tamamen değiştirin ve kaydedin.</li>
                     <li>Terminalden <code>git add .</code>, <code>git commit -m "update"</code> ve <code>git push</code> komutlarını çalıştırın.</li>
                   </ol>
                 </div>
               </div>
             </div>

             <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
               <div className="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
                 <span className="text-slate-400 font-mono text-sm">constants.ts</span>
                 <Button 
                   onClick={handleCopyCode} 
                   className={copied ? "!bg-green-600 !text-white" : "!bg-white !text-slate-900"}
                   icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 >
                   {copied ? 'Kopyalandı!' : 'Kodu Kopyala'}
                 </Button>
               </div>
               <div className="p-4 overflow-x-auto">
                 <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                   {generateExportCode()}
                 </pre>
               </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
};
