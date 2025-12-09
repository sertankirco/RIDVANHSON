import React, { useState, FC, ReactNode } from 'react';
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
}): ReactNode => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'new' | 'videos' | 'experience' | 'settings' | 'export'>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Post Form State
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostSummary, setNewPostSummary] = useState<string>('');
  const [newPostImage, setNewPostImage] = useState<string>('');
  
  // Video Form State
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDesc, setVideoDesc] = useState<string>('');

  // Experience Form State
  const [expCompany, setExpCompany] = useState<string>('');
  const [expRole, setExpRole] = useState<string>('');
  const [expPeriod, setExpPeriod] = useState<string>('');
  const [expDesc, setExpDesc] = useState<string>('');
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // AI State
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('');

  // Settings State
  const [editContent, setEditContent] = useState<SiteContent>(siteContent);

  // Export State
  const [copied, setCopied] = useState<boolean>(false);

  // ... (Fonksiyonlar burada aynı kalacak)

  return (
    // ... (JSX kısmı aynı kalacak)
  );
};
