
import React, { useState, useEffect } from 'react';
import { BlogPost, SiteContent } from './types';
import { INITIAL_POSTS, INITIAL_SITE_CONTENT, APP_VERSION } from './constants';
import { BlogCard } from './components/BlogCard';
import { PostModal } from './components/PostModal';
import { BioModal } from './components/BioModal';
import { Button } from './components/Button';
import { VideoPlayer } from './components/VideoPlayer';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { getValidImageUrl } from './utils/image';
import { 
  Sparkles, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  BookOpen,
  Menu,
  X,
  Lock,
  ArrowRight,
  Play,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Send
} from 'lucide-react';

type ViewMode = 'public' | 'login' | 'admin';

export default function App() {
  // Versiyon Kontrolü: Eski verileri temizle
  useEffect(() => {
    const savedVersion = localStorage.getItem('app_version');
    if (savedVersion !== APP_VERSION) {
      // Eğer versiyon değişmişse, kullanıcıya yeni yapıyı göstermek için versiyonu güncelle
      localStorage.setItem('app_version', APP_VERSION);
    }
  }, []);

  // Posts State
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    // Versiyon kontrolü: Eğer versiyon farklıysa yeni postları yükle
    const savedVersion = localStorage.getItem('app_version');
    if (savedVersion !== APP_VERSION) {
      return INITIAL_POSTS;
    }
    const saved = localStorage.getItem('blog_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  // Site Content State
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    // Versiyon kontrolü: Eğer versiyon farklıysa yeni site içeriğini yükle
    const savedVersion = localStorage.getItem('app_version');
    if (savedVersion !== APP_VERSION) {
      return INITIAL_SITE_CONTENT;
    }

    const saved = localStorage.getItem('site_content');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Eski veri yapısını yenisiyle birleştir (güvenlik için)
      return {
        ...INITIAL_SITE_CONTENT,
        ...parsed,
        hero: { ...INITIAL_SITE_CONTENT.hero, ...(parsed.hero || {}) },
        about: { ...INITIAL_SITE_CONTENT.about, ...(parsed.about || {}) },
        socialMedia: { ...INITIAL_SITE_CONTENT.socialMedia, ...(parsed.socialMedia || {}) },
        contact: { ...INITIAL_SITE_CONTENT.contact, ...(parsed.contact || {}) },
        videos: parsed.videos || INITIAL_SITE_CONTENT.videos,
        experience: parsed.experience || INITIAL_SITE_CONTENT.experience
      };
    }
    return INITIAL_SITE_CONTENT;
  });

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Contact Form State
  const [contactFormStatus, setContactFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  
  // Routing State
  const [viewMode, setViewMode] = useState<ViewMode>('public');

  // Persist changes
  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPost(null), 300);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactFormStatus('sending');
    // Simulate sending
    setTimeout(() => {
      setContactFormStatus('success');
      setTimeout(() => setContactFormStatus('idle'), 3000);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

  // Admin Views
  if (viewMode === 'login') {
    return <AdminLogin onLogin={() => setViewMode('admin')} onBack={() => setViewMode('public')} />;
  }

  if (viewMode === 'admin') {
    return (
      <AdminPanel 
        posts={posts} 
        setPosts={setPosts} 
        siteContent={siteContent}
        onUpdateSiteContent={setSiteContent}
        onLogout={() => setViewMode('public')} 
        onViewSite={() => setViewMode('public')}
      />
    );
  }

  // Public View
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="fixed w-full top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">
              {siteContent.personal.name.split(' ').map(n => n[0]).join('').substring(0,2)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">{siteContent.personal.name}</h1>
              <p className="text-xs text-slate-500 font-medium">{siteContent.personal.title}</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors">Hakkımda</button>
            <button onClick={() => scrollToSection('career')} className="hover:text-blue-600 transition-colors">Kariyer</button>
            <button onClick={() => scrollToSection('videos')} className="hover:text-blue-600 transition-colors">Videolarım</button>
            <button onClick={() => scrollToSection('blog')} className="hover:text-blue-600 transition-colors">Blog</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors">İletişim</button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 shadow-lg absolute w-full left-0">
            <div className="flex flex-col space-y-4 font-medium text-slate-600">
              <button onClick={() => scrollToSection('about')} className="text-left py-2 hover:text-blue-600">Hakkımda</button>
              <button onClick={() => scrollToSection('career')} className="text-left py-2 hover:text-blue-600">Kariyer</button>
              <button onClick={() => scrollToSection('videos')} className="text-left py-2 hover:text-blue-600">Videolarım</button>
              <button onClick={() => scrollToSection('blog')} className="text-left py-2 hover:text-blue-600">Blog</button>
              <button onClick={() => scrollToSection('contact')} className="text-left py-2 hover:text-blue-600">İletişim</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full mb-6">
              {siteContent.hero.badge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {siteContent.hero.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{siteContent.hero.titleHighlight}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              {siteContent.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button onClick={() => scrollToSection('about')} className="!bg-blue-600 !text-white px-8 py-3 h-auto text-lg">
                Hakkımda Daha Fazla
              </Button>
              <Button variant="secondary" onClick={() => scrollToSection('blog')} className="px-8 py-3 h-auto text-lg">
                Yazılarımı Oku
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              {/* Image Container with Border and Clipping */}
              <div className="relative w-full h-full rounded-full border-8 border-white shadow-2xl z-10 overflow-hidden bg-white">
                <img 
                    src={getValidImageUrl(siteContent.hero.imageUrl)} 
                    alt={siteContent.personal.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{ 
                        objectPosition: `${siteContent.hero.imagePositionX ?? 50}% ${siteContent.hero.imagePositionY ?? 50}%`,
                        transform: `scale(${siteContent.hero.imageScale ?? 1})`
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(siteContent.personal.name)}&background=random&size=512`;
                    }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg z-20 flex items-center gap-3 animate-fadeIn">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Deneyim</p>
                  <p className="text-lg font-bold text-slate-900">{siteContent.hero.experienceYears}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Education Section */}
      <section id="about" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <span className="bg-blue-600 w-2 h-8 mr-4 rounded-full"></span>
                {siteContent.about.title}
              </h2>
              <div className="prose prose-lg text-slate-600">
                <p>
                  {siteContent.about.shortSummary}
                </p>
              </div>
              <div className="mt-8">
                <button 
                  onClick={() => setIsBioModalOpen(true)}
                  className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                >
                  Tam Biyografiyi Oku <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <GraduationCap className="w-8 h-8 mr-3 text-blue-600" />
                Eğitim
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">İstanbul Kültür Üniversitesi</h3>
                  <p className="text-blue-600">Yönetim Ekonomisi (Tezli Yüksek Lisans)</p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    “Türkiye’de Dış Ticaret İle Ekonomik Büyüme Arasındaki İlişki” konulu bitirme tezi.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">Anadolu Üniversitesi</h3>
                  <p className="text-blue-600">İktisat Fakültesi</p>
                  <p className="text-sm text-slate-500 mt-1">Lisans Derecesi</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">Trakya Üniversitesi</h3>
                  <p className="text-blue-600">KMYO Muhasebe Bölümü</p>
                  <p className="text-sm text-slate-500 mt-1">Ön Lisans Derecesi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline - DYNAMIC */}
      <section id="career" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Profesyonel Yolculuk</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            
            {(siteContent.experience || []).map((exp, index) => (
              <div key={exp.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${index === 0 ? 'is-active' : ''}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-600 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <h3 className="font-bold text-slate-900">{exp.company}</h3>
                    <time className="font-mono italic text-sm text-slate-500">{exp.period}</time>
                  </div>
                  <div className="text-blue-600 font-medium mb-2">{exp.role}</div>
                  <p className="text-slate-600 text-sm">{exp.description}</p>
                </div>
              </div>
            ))}

            {(!siteContent.experience || siteContent.experience.length === 0) && (
              <div className="text-center text-slate-500 py-10">Henüz kariyer bilgisi eklenmemiş.</div>
            )}

          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-20 bg-slate-900 text-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-center gap-3 mb-12 justify-center md:justify-start">
             <div className="p-3 bg-red-600 rounded-lg">
                <Play className="w-6 h-6 text-white" />
             </div>
             <div>
                <h2 className="text-3xl font-bold">Videolarım</h2>
                <p className="text-slate-400 text-sm">Sektörel değerlendirmeler ve yayın kayıtları.</p>
             </div>
           </div>

           {(!siteContent.videos || siteContent.videos.length === 0) ? (
             <div className="text-center text-slate-500 py-10">Henüz video eklenmemiş.</div>
           ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {siteContent.videos.map((video) => (
                  <div key={video.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-red-500 transition-colors group shadow-lg flex flex-col">
                    <div className="relative aspect-video w-full">
                       <VideoPlayer url={video.url} title={video.title} />
                    </div>
                    <div className="p-6 bg-slate-800 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors line-clamp-2">{video.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-3">{video.description}</p>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </section>

      {/* Roles & Associations */}
      <section id="roles" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Sektörel Görevler & Üyelikler</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Sivil toplum kuruluşlarında aktif rol alarak sektörün gelişimine katkı sağlamaya çalışıyorum.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-500 transition-colors shadow-sm">
              <Globe className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold mb-2 text-slate-900">UTİKAD</h3>
              <p className="text-blue-600 text-sm mb-4">Yönetim Kurulu Üyesi</p>
              <p className="text-slate-600 text-sm">Uluslararası Taşımacılık ve Lojistik Hizmet Üretenleri Derneği'nde sektörün uluslararası temsili için çalışmalar.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-500 transition-colors shadow-sm">
              <Award className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold mb-2 text-slate-900">İGMD</h3>
              <p className="text-blue-600 text-sm mb-4">Başkan Vekili</p>
              <p className="text-slate-600 text-sm">İstanbul Gümrük Müşavirleri Derneği'nde mesleki standartların yükseltilmesi ve etik değerlerin korunması.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-500 transition-colors shadow-sm">
              <BookOpen className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold mb-2 text-slate-900">Eğitmen</h3>
              <p className="text-blue-600 text-sm mb-4">Akademik & Sektörel</p>
              <p className="text-slate-600 text-sm">UTİKAD Akademi, İstanbul Ticaret Üniversitesi, Beykent Üniversitesi gibi kurumlarda Dış Ticaret ve Gümrük eğitimleri.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Makaleler & Görüşler</h2>
              <p className="text-slate-500 mt-2">Sektörel değerlendirmeler ve vizyon yazıları.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard 
                key={post.id} 
                post={post} 
                onClick={handlePostClick} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 scroll-mt-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">İletişime Geçin</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Gümrük, dış ticaret veya lojistik süreçlerinizle ilgili danışmanlık almak, eğitim talepleri oluşturmak veya tanışmak için aşağıdaki kanallardan bana ulaşabilirsiniz.
              </p>
              
              <div className="space-y-6">
                 {siteContent.contact?.email && (
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-blue-600 shadow-sm shrink-0">
                         <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">E-Posta</h4>
                        <a href={`mailto:${siteContent.contact.email}`} className="text-slate-600 hover:text-blue-600 transition-colors">
                          {siteContent.contact.email}
                        </a>
                      </div>
                    </div>
                 )}
                 
                 {siteContent.contact?.phone && (
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-green-600 shadow-sm shrink-0">
                         <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Telefon</h4>
                        <a href={`tel:${siteContent.contact.phone.replace(/\s+/g, '')}`} className="text-slate-600 hover:text-blue-600 transition-colors">
                          {siteContent.contact.phone}
                        </a>
                      </div>
                    </div>
                 )}

                 {siteContent.contact?.address && (
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-red-600 shadow-sm shrink-0">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Adres</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-2">
                          {siteContent.contact.address}
                        </p>
                        {siteContent.contact.mapUrl && (
                          <a 
                            href={siteContent.contact.mapUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-blue-600 hover:underline flex items-center"
                          >
                             Haritada Görüntüle <ArrowRight className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                 )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Mesaj Gönderin</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Adınız Soyadınız</label>
                     <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Örn: Ahmet Yılmaz" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">E-Posta Adresiniz</label>
                     <input required type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="ornek@sirket.com" />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Konu</label>
                   <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Örn: Danışmanlık Talebi" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Mesajınız</label>
                   <textarea required rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Mesajınızı buraya yazın..."></textarea>
                </div>
                
                <Button 
                   type="submit" 
                   className="w-full justify-center !bg-slate-900 hover:!bg-slate-800"
                   disabled={contactFormStatus !== 'idle'}
                   icon={contactFormStatus === 'success' ? <div className="text-green-400">✓</div> : <Send className="w-4 h-4" />}
                >
                  {contactFormStatus === 'idle' && 'Gönder'}
                  {contactFormStatus === 'sending' && 'Gönderiliyor...'}
                  {contactFormStatus === 'success' && 'Mesajınız İletildi!'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-serif font-bold text-sm">
                {siteContent.personal.name.split(' ').map(n => n[0]).join('').substring(0,2)}
              </div>
              <span className="font-semibold text-slate-900">{siteContent.personal.name} © {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex gap-4">
              {siteContent.socialMedia?.twitter && (
                <a href={siteContent.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-900 hover:text-white transition-all" title="X (Twitter)">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {siteContent.socialMedia?.facebook && (
                <a href={siteContent.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-600 hover:text-white transition-all" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {siteContent.socialMedia?.instagram && (
                <a href={siteContent.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-pink-600 hover:text-white transition-all" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {siteContent.socialMedia?.youtube && (
                <a href={siteContent.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-red-600 hover:text-white transition-all" title="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
               {siteContent.socialMedia?.linkedin && (
                <a href={siteContent.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-blue-700 hover:text-white transition-all" title="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-between items-center text-sm text-slate-400">
            <p>Mundoimex Global Lojistik ve Dış Ticaret A.Ş.</p>
            <button 
              onClick={() => setViewMode('login')} 
              className="flex items-center gap-1 hover:text-slate-600 transition-colors"
            >
              <Lock className="w-3 h-3" /> Yönetici Girişi
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PostModal 
        post={selectedPost} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
      
      <BioModal
        content={siteContent.about.fullBiography}
        name={siteContent.personal.name}
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
      />
    </div>
  );
}
