import { BlogPost, SiteContent } from './types';

export const INITIAL_SITE_CONTENT: SiteContent = {
  personal: {
    name: "Rıdvan Haliloğlu",
    title: "Gümrük Müşaviri & Eğitmen"
  },
  hero: {
    badge: "Mundoimex YK Başkanı",
    titleLine1: "Lojistik, Dış Ticaret ve",
    titleHighlight: "Sen Ben Yok",
    description: "1998'den beri sektörün içinde; Gümrük Müşaviri, Eğitmen ve Sektör Lideri olarak deneyimlerimi, dijital dönüşüm vizyonuyla birleştiriyorum.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    experienceYears: "25+ Yıl"
  },
  about: {
    title: "Biyografi",
    paragraph1: "1971 yılında Giresun'da doğdum. İlk, orta ve lise öğrenimimi İstanbul'da tamamladım. Evli ve üç çocuk babasıyım. Profesyonel hayatımın yanı sıra akademik çalışmalara ve sektörel sivil toplum kuruluşlarındaki görevlerime büyük önem veriyorum.",
    paragraph2: "Sürekli öğrenmenin ve öğretmenin gücüne inanıyorum. Gümrük ve dış ticaret alanındaki bilgi birikimimi genç nesillere aktarmak en büyük motivasyon kaynaklarımdan biri."
  }
};

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Gümrüklerde Dijital Dönüşüm ve Endüstri 4.0',
    summary: 'Dijital gümrük uygulamaları, blockchain teknolojisi ve lojistikte veri yönetiminin geleceği üzerine bir değerlendirme.',
    content: `Dünya ticareti hızla dijitalleşirken, gümrük süreçlerinin bu dönüşüme ayak uydurması artık bir tercih değil, zorunluluktur. "Dijital Gümrükler" kavramı, sadece evrak işlerinin elektronik ortama taşınması değil, verinin akıllıca işlenmesi ve süreçlerin optimize edilmesidir.

    Endüstri 4.0 ile birlikte lojistik ve tedarik zinciri yönetimi, nesnelerin interneti (IoT) ve yapay zeka ile yeniden şekilleniyor. Gümrük idarelerinin bu teknolojileri entegre etmesi, ticaretin hızını artırırken maliyetleri düşürecektir.

    Özellikle Blockchain teknolojisi, şeffaflık ve güvenilirlik açısından devrim niteliğinde fırsatlar sunuyor. Tek Pencere Sistemi (TPS) gibi uygulamalar başlangıç olsa da, tam entegre bir dijital ekosistem için daha atılacak çok adım var.`,
    author: 'Rıdvan Haliloğlu',
    date: '15 Kasım 2023',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    tags: ['Dijitalleşme', 'Gümrük', 'Teknoloji']
  },
  {
    id: '2',
    title: 'Lojistik Sektöründe Eğitimin Geleceği',
    summary: 'Genç gümrük müşavirleri ve lojistikçiler için sürekli eğitimin önemi ve akademik yaklaşımlar.',
    content: `Lojistik, sadece malların A noktasından B noktasına taşınması değil, karmaşık mevzuatların ve operasyonel süreçlerin yönetildiği multidisipliner bir alandır. Bu nedenle, sektör çalışanlarının eğitimi hayati önem taşır.

    UTİKAD Akademi ve üniversitelerde verdiğim derslerde her zaman vurguladığım bir nokta var: "Bilgi, lojistiğin en değerli yüküdür." Teorik bilginin saha tecrübesiyle harmanlanması, nitelikli iş gücünün temelini oluşturur.

    Geleceğin lojistikçileri, sadece mevzuatı ezberleyen değil, analitik düşünebilen, kriz yönetebilen ve teknolojiyi etkin kullanabilen bireyler olmalıdır. Mentorluk sistemleri ve üniversite-sektör işbirlikleri bu noktada kilit rol oynuyor.`,
    author: 'Rıdvan Haliloğlu',
    date: '02 Aralık 2023',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop',
    tags: ['Eğitim', 'Kariyer', 'Mentörlük']
  },
  {
    id: '3',
    title: 'Dış Ticarette Yeni Dönem: 2024 Vizyonu',
    summary: 'Küresel ekonomik dalgalanmaların gölgesinde 2024 yılı dış ticaret ve gümrük beklentileri.',
    content: `Küresel tedarik zincirindeki kırılmalar ve jeopolitik gerginlikler, 2024 yılında dış ticaret stratejilerini yeniden gözden geçirmemizi gerektiriyor. "Nearshoring" (yakından tedarik) eğilimi, Türkiye'nin stratejik önemini artırıyor.

    Yeni Gümrük Kanunu çalışmaları ve mevzuat düzenlemeleri, sektörün önünü açacak önemli gelişmelerdir. İhracat odaklı büyüme modelinde, gümrük süreçlerinin basitleştirilmesi ve hızlandırılması rekabet gücümüzü doğrudan etkileyecektir.

    Mundoimex olarak vizyonumuz, bu değişimleri önceden öngörüp müşterilerimize proaktif çözümler sunmaktır. 2024, zorluklarla birlikte büyük fırsatları da beraberinde getirecek.`,
    author: 'Rıdvan Haliloğlu',
    date: '10 Ocak 2024',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop',
    tags: ['Dış Ticaret', 'Ekonomi', 'Vizyon']
  }
];
