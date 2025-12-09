// Gerekli import'ları ekleyelim
import React, { useState, FC } from 'react';
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
  Settings,
  Save,
  Code,
  Copy,
  Check,
  Github,
  Edit,
  Play,
  Briefcase
} from 'lucide-react';

interface AdminPanelProps {
  posts: BlogPost[];
  setPosts: (posts: BlogPost[]) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
  onLogout: () => void;
  onViewSite: () => void;
}

export const AdminPanel: FC<AdminPanelProps> = ({ 
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
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  // Settings State
  const [editContent, setEditContent] = useState<SiteContent>(siteContent);

  // Export State
  const [copied, setCopied] = useState(false);

  // ... (diğer fonksiyonlar aynı kalacak, sadece type düzeltmeleri yapıldı)

  // --- Experience Functions ---
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExpId) {
      // Update existing experience
      const updatedExp: Experience = {
        id: editingExpId,
        company: expCompany,
        role: expRole,
        period: expPeriod,
        description: expDesc
      };

      const currentExp = siteContent.experience || [];
      const updatedContent = { 
        ...siteContent, 
        experience: currentExp.map(exp => exp.id === editingExpId ? updatedExp : exp)
      };

      onUpdateSiteContent(updatedContent);
      setEditContent(updatedContent);

      // Reset form and editing state
      setEditingExpId(null);
      setExpCompany('');
      setExpRole('');
      setExpPeriod('');
      setExpDesc('');
      
      alert('Deneyim başarıyla güncellendi!');
    } else {
      // Create new experience
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

      setExpCompany('');
      setExpRole('');
      setExpPeriod('');
      setExpDesc('');
      alert('Deneyim eklendi!');
    }
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExpId(exp.id);
    setExpCompany(exp.company);
    setExpRole(exp.role);
    setExpPeriod(exp.period);
    setExpDesc(exp.description);
    setActiveTab('experience');
  };

  const handleDeleteExperience = (id: string) => {
    if (window.confirm('Bu deneyimi silmek istediğinize emin misiniz?')) {
       const currentExp = siteContent.experience || [];
       const updatedExp = currentExp.filter(e => e.id !== id);
       const updatedContent = { ...siteContent, experience: updatedExp };
       onUpdateSiteContent(updatedContent);
       setEditContent(updatedContent);
       setEditingExpId(null); // Reset editing state if deleting current item
    }
  };

  // ... (diğer fonksiyonlar aynı kalacak)

  return (
    // ... (JSX kısmı aynı kalacak)
  );
};
