// ... (previous imports remain the same)

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  posts, 
  setPosts, 
  siteContent,
  onUpdateSiteContent,
  onLogout, 
  onViewSite 
}) => {
  // ... (previous state declarations remain the same)

  // Experience Form State
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [editingExpId, setEditingExpId] = useState<string | null>(null); // New state for editing

  // ... (rest of state declarations remain the same)

  // --- Experience Functions ---
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExpId) {
      // Update existing experience
      const updatedExp = {
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

  // ... (rest of the component remains the same until the experience section)

  {activeTab === 'experience' && (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Profesyonel Yolculuk Yönetimi</h1>
      </div>
      
      {/* Add/Edit Experience Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {editingExpId ? 'Deneyimi Düzenle' : 'Yeni Deneyim Ekle'}
        </h3>
        <form onSubmit={handleAddExperience} className="space-y-4">
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
          <div className="flex justify-end gap-4">
            {editingExpId && (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setEditingExpId(null);
                  setExpCompany('');
                  setExpRole('');
                  setExpPeriod('');
                  setExpDesc('');
                }}
              >
                İptal
              </Button>
            )}
            <Button type="submit" icon={<Plus className="w-4 h-4" />}>
              {editingExpId ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </div>

      {/* Existing Experience List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Mevcut Deneyimler</h3>
        <div className="space-y-4">
          {(siteContent.experience && siteContent.experience.length > 0) ? (
            siteContent.experience.map(exp => (
              <div key={exp.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
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
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    title="Düzenle"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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

  // ... (rest of the component remains the same)
};
