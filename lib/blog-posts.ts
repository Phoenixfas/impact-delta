export interface ArticleSection {
  id: string;
  title: string;
  level: 2 | 3;
  content: string[];
  callout?: {
    type: "blueprint" | "quote" | "telemetry";
    title?: string;
    text: string;
    meta?: string;
  };
}

export interface DetailedBlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  tags: string[];
  readTime: string;
  date: string;
  updatedDate?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  heroImage: string;
  heroImageAlt: string;
  caption?: string;
  editorialBadge?: string;
  metrics?: { label: string; value: string };
  sections: ArticleSection[];
  relatedSlugs: string[];
}

export const DETAILED_BLOG_POSTS: Record<string, DetailedBlogPost> = {
  "navigating-dwtc-dec-stand-guidelines": {
    slug: "navigating-dwtc-dec-stand-guidelines",
    title: "Navigating DWTC & DEC Stand Guidelines 2026: The Comprehensive Builder's Guide",
    subtitle:
      "A complete operational roadmap for exhibition organizers and corporate exhibitors: height restrictions, double-decker structural approvals, and Dubai Civil Defense compliance.",
    excerpt:
      "Building at Dubai World Trade Centre (DWTC) and Dubai Exhibition Centre (DEC) requires strict adherence to venue safety, height clearances, and structural PE stamps. Here is our master guide.",
    category: "exhibition-stands",
    categoryLabel: "Stand Fabrication",
    categoryColor: "blue",
    tags: ["DWTC Guidelines", "DEC Dubai", "Double-Decker Permits", "Civil Defense", "Stand Fabrication"],
    readTime: "8 Min Read",
    date: "Aug 24, 2026",
    updatedDate: "Aug 28, 2026",
    author: {
      name: "Tariq Al-Mansoor",
      role: "Managing Director & Founder",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Tariq leads Impact Makers Events L.L.C with over 18 years directing 500+ exhibition stand builds and global B2B congresses across the UAE, Europe, and Asia.",
    },
    heroImage: "/images/prev/booth_1.webp",
    heroImageAlt: "Custom double-decker exhibition stand built at Dubai World Trade Centre",
    caption: "Turnkey double-decker pavilion engineered by Impact Makers Events at DWTC, featuring certified cantilever VIP suites.",
    editorialBadge: "EXHIBITION GUIDE // 2026",
    metrics: { label: "Approval Rate", value: "100%" },
    relatedSlugs: [
      "in-house-cnc-joinery-vs-subcontracting",
      "triple-iso-standards-in-event-management",
      "curved-4k-led-and-concert-sound-in-pavilions",
    ],
    sections: [
      {
        id: "dwtc-dec-framework",
        title: "The Regulatory Landscape of Dubai's Premier Exhibition Halls",
        level: 2,
        content: [
          "Dubai World Trade Centre (DWTC) and Dubai Exhibition Centre (DEC at Expo City) represent the epicenter of Middle Eastern commerce. However, executing an ambitious custom stand or double-decker structure requires navigating complex safety, electrical, and structural clearance protocols.",
          "At Impact Makers Events L.L.C, our in-house engineering and permitting desk manages the entire submission pipeline—ensuring every CAD blueprint, fire-retardant certification, and structural PE calculation receives first-pass approval well ahead of build-up week.",
        ],
        callout: {
          type: "blueprint",
          title: "DWTC Height & Setback Regulations",
          text: "Standard single-tier stands can build up to 4.0m to 6.0m depending on hall boundaries. Multi-tier double-deckers require a minimum 2.0m setback from adjoining booth boundaries, full structural load calculations (5.0 kN/m² mezzanine rating), and Dubai Civil Defense fire suppression integration.",
          meta: "Source: Impact Makers Events Permitting Desk, 2026",
        },
      },
      {
        id: "structural-pe-stamps",
        title: "Structural Load Calculations & PE-Stamped Double-Deckers",
        level: 2,
        content: [
          "For double-decker hospitality suites, structural stability is paramount. DWTC and DEC mandate that all multi-story designs be accompanied by signed and stamped structural calculations by a certified UAE Professional Engineer (PE).",
          "Our structural welding team pre-fabricates modular steel subframes inside our Dubai workshop. We pre-test every cantilever connection and stair stringer under calibrated static loads, eliminating unexpected on-site structural modifications during the pressurized 48-hour build window.",
        ],
      },
      {
        id: "electrical-fire-safety",
        title: "Electrical Distribution & Dubai Civil Defense Fire Standards",
        level: 3,
        content: [
          "All timber joinery, fabrics, and raised flooring materials must be treated with Class 1 fire-retardant coatings and accompanied by certified laboratory test reports. Electrical power drops must be balanced across 3-phase supplies with dedicated residual-current circuit breakers (RCCB).",
          "Impact Makers Events maintains 100% compliance across all electrical boards and wiring ducts, guaranteeing zero power trip disruptions for high-draw LED video walls and demo stations.",
        ],
        callout: {
          type: "telemetry",
          title: "Permitting Track Record",
          text: "100% first-submission approval rate across 500+ custom booth builds at DWTC, DEC, ADNEC, and Riyadh Front.",
        },
      },
      {
        id: "conclusion-dwtc",
        title: "Early Permitting: The Key to a Stress-Free Exhibition",
        level: 2,
        content: [
          "Submitting blueprints at least 30 days prior to event move-in prevents late penalty surcharges and guarantees prioritized crane and rigging slots. By partnering with an accredited turnkey contractor who operates their own Dubai workshop, exhibitors eliminate middleman delays and focus entirely on commercial networking.",
        ],
      },
    ],
  },
  "in-house-cnc-joinery-vs-subcontracting": {
    slug: "in-house-cnc-joinery-vs-subcontracting",
    title: "Why In-House CNC Joinery Outperforms Subcontracted Stand Building in Dubai",
    subtitle:
      "A deep dive into manufacturing control, sub-millimeter tolerances, custom paint finishes, and eliminating the hidden 35% middleman surcharge.",
    excerpt:
      "Most exhibition agencies subcontract carpentry to third-party workshops, creating quality bottlenecks and delayed handovers. Discover why in-house fabrication is essential.",
    category: "exhibition-stands",
    categoryLabel: "Stand Fabrication",
    categoryColor: "blue",
    tags: ["CNC Milling", "In-House Workshop", "Timber Joinery", "Polyurethane Paint", "Dubai Fabrication"],
    readTime: "7 Min Read",
    date: "Aug 20, 2026",
    author: {
      name: "Viktor Kowalski",
      role: "Director of In-House Fabrication",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Viktor manages Impact Makers Events' dedicated Dubai manufacturing atelier, supervising 5-axis CNC joinery, steel welding, and high-gloss paint finishing.",
    },
    heroImage: "/images/kinetic-installation.jpg",
    heroImageAlt: "In-house 5-axis CNC router milling precision timber curves for exhibition booth",
    caption: "5-axis CNC machining center milling bespoke organic curves inside Impact Makers Events' Dubai workshop.",
    editorialBadge: "MANUFACTURING LAB",
    metrics: { label: "Tolerance", value: "±0.5mm" },
    relatedSlugs: [
      "navigating-dwtc-dec-stand-guidelines",
      "triple-iso-standards-in-event-management",
      "curved-4k-led-and-concert-sound-in-pavilions",
    ],
    sections: [
      {
        id: "the-broker-problem",
        title: "The Broker Problem in Exhibition Stand Contracting",
        level: 2,
        content: [
          "Across the UAE exhibition landscape, a substantial percentage of design agencies operate as pure commercial brokers: they pitch 3D renders, win contracts, and immediately subcontract the physical build to lowest-bidder third-party carpentry shops.",
          "This fractured model creates severe risks: misaligned brand colors, poor edge finishing, structurally flimsy double-deckers, and frantic last-minute fixes on the exhibition floor hours before the opening ceremony.",
        ],
      },
      {
        id: "the-inhouse-advantage",
        title: "The In-House Manufacturing Atelier Advantage",
        level: 2,
        content: [
          "Impact Makers Events L.L.C was founded on an unshakeable premise: direct manufacturing control produces superior quality. By investing in our own Dubai fabrication facility equipped with 5-axis CNC routers, steel welding bays, and pressurized spray booths, we control every cut, joint, and coat of paint.",
          "Our master joiners pre-assemble all custom cabinetry, reception counters, and acrylic lightboxes in our facility for quality inspection before loading onto transport trucks.",
        ],
        callout: {
          type: "blueprint",
          title: "Workshop Quality Audit",
          text: "100% pre-assembly in our workshop reduces on-site build snags to under 0.2% and guarantees early handover at least 12 hours prior to exhibition hall opening.",
          meta: "Source: Impact Makers Events Operations Audit",
        },
      },
      {
        id: "surface-finishing",
        title: "Cleanroom Paint Finishing vs On-Site Spraying",
        level: 3,
        content: [
          "On-site paint application in a dusty exhibition hall inevitably causes orange-peel textures and dust particle entrapment. In our dust-filtered downdraft spray booths, we apply multi-coat polyurethane primers and satin clear-coats that cure under controlled heat lamps.",
          "The result is a flawless luxury automotive-grade finish that reflects your corporate stature.",
        ],
      },
    ],
  },
  "triple-iso-standards-in-event-management": {
    slug: "triple-iso-standards-in-event-management",
    title: "Triple ISO Standards in Event Management: Quality, Sustainability & Safety",
    subtitle:
      "How ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certifications by Universal Registrars protect corporate investments at world-class events.",
    excerpt:
      "Enterprise events demand rigorous governance. Explore how our triple ISO accreditations ensure flawless quality, environmental responsibility, and zero-accident occupational safety.",
    category: "event-management",
    categoryLabel: "Event Management",
    categoryColor: "emerald",
    tags: ["ISO 9001", "ISO 14001", "ISO 45001", "Universal Registrars", "Corporate Governance"],
    readTime: "6 Min Read",
    date: "Aug 15, 2026",
    author: {
      name: "Tariq Al-Mansoor",
      role: "Managing Director & Founder",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Tariq has architected quality and safety protocols across 500+ high-stakes international summits and exhibitions.",
    },
    heroImage: "/images/executive-pavilion.jpg",
    heroImageAlt: "Corporate summit hall operating under strict ISO quality and safety protocols",
    caption: "Impact Makers Events L.L.C is audited and certified by Universal Registrars across all core service lines.",
    editorialBadge: "GOVERNANCE & STANDARDS",
    metrics: { label: "ISO Accreditations", value: "3x Certified" },
    relatedSlugs: [
      "navigating-dwtc-dec-stand-guidelines",
      "in-house-cnc-joinery-vs-subcontracting",
      "diplomatic-protocol-in-international-congresses",
    ],
    sections: [
      {
        id: "iso-pillar-quality",
        title: "ISO 9001:2015 — Quality Management in High-Stakes Production",
        level: 2,
        content: [
          "Delivering complex B2B congresses, double-decker exhibition stands, and multi-tier AV systems leaves zero room for oversight. Our ISO 9001:2015 certified Quality Management System enforces standardized 24-point pre-flight checklists for every project.",
          "From CAD tolerance verification to equipment calibration and post-event CSAT audits, every process is traceable, documented, and continually optimized.",
        ],
      },
      {
        id: "iso-pillar-environment",
        title: "ISO 14001:2015 — Sustainable Event Production & Green Strikes",
        level: 2,
        content: [
          "Temporary events historically generate substantial waste. Under our ISO 14001:2015 Environmental Management certification, Impact Makers Events prioritizes modular timber structures, low-energy LED fixtures, non-toxic water-based finishes, and certified post-show material recycling.",
          "Our green dismantle protocols divert over 85% of structural timber and steel components away from landfills into circular asset vaults.",
        ],
      },
      {
        id: "iso-pillar-safety",
        title: "ISO 45001:2018 — Occupational Health & Safety on the Build Floor",
        level: 2,
        content: [
          "Exhibition halls during build-up are active industrial construction zones. Rigging heavy trusses, operating scissor lifts, and maneuvering structural glass panels demand unyielding safety protocols.",
          "Our ISO 45001:2018 certification mandates certified PPE, daily site safety briefings, load-rated rigging equipment, and certified first-aid personnel at every job site.",
        ],
      },
    ],
  },
  "curved-4k-led-and-concert-sound-in-pavilions": {
    slug: "curved-4k-led-and-concert-sound-in-pavilions",
    title: "Integrating Curved 4K LED Ribbons & Concert Audio into B2B Pavilions",
    subtitle:
      "Transforming exhibition booths into immersive brand theaters with fine-pitch 2.6mm LED, Brompton Tessera processing, and cardioid beamforming acoustics.",
    excerpt:
      "A technical walkthrough of how broadcast-grade curved LED video ribbons and directional line arrays command foot traffic and stop trade show attendees in their tracks.",
    category: "event-tech",
    categoryLabel: "Audiovisual & Tech",
    categoryColor: "sky",
    tags: ["Curved LED", "Brompton SX40", "d&b Line Arrays", "AV Systems", "Exhibition Technology"],
    readTime: "7 Min Read",
    date: "Aug 10, 2026",
    author: {
      name: "Jean-Paul Laurent",
      role: "Head of Audiovisual Systems",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Jean-Paul oversees large-format LED displays, concert sound reinforcement, and stage lighting across Impact Makers Events' global installations.",
    },
    heroImage: "/images/summit-keynote.jpg",
    heroImageAlt: "Curved 4K LED video ribbon wall with vibrant digital content and concert lighting",
    caption: "Seamless concave 4K LED ribbon installed on an executive tech pavilion in Dubai.",
    editorialBadge: "AV ENGINEERING",
    metrics: { label: "Pixel Pitch", value: "2.6mm" },
    relatedSlugs: [
      "navigating-dwtc-dec-stand-guidelines",
      "in-house-cnc-joinery-vs-subcontracting",
      "the-architecture-of-awe",
    ],
    sections: [
      {
        id: "curved-led-mechanics",
        title: "The Visual Magnetism of Organic Curved LED Ribbons",
        level: 2,
        content: [
          "In a crowded exhibition hall with hundreds of competing booths, flat rectangular video screens fade into background visual noise. Seamless curved LED video ribbons—flowing across stand canopies, archways, and reception counters—create an inescapable visual vortex.",
          "Using fine-pitch 2.6mm ROE Visual BP2V2 panels driven by Brompton Tessera SX40 8K processors, we achieve true 12-bit HDR color reproduction that looks pristine under harsh exhibition hall floodlights.",
        ],
      },
      {
        id: "acoustic-containment",
        title: "Sound Directivity & Avoiding Venue Decibel Penalties",
        level: 2,
        content: [
          "Exhibition organizers impose strict decibel limits (typically 75–80 dB at booth perimeter). Traditional speakers blast sound into neighboring stands, triggering security warnings and power cutoffs.",
          "We deploy focused line arrays and directional beamforming acoustic panels that direct crisp dialogue and punchy bass exclusively into your booth's presentation zone, maintaining acoustic intimacy without venue infractions.",
        ],
      },
    ],
  },
  "the-architecture-of-awe": {
    slug: "the-architecture-of-awe",
    title: "The Architecture of Awe: Engineering High-Impact B2B Pavilions & Congress Arenas",
    subtitle:
      "How spatial design, in-house joinery, and synchronous audiovisuals bring global brand narratives to life across 9 countries.",
    excerpt:
      "Connecting businesses worldwide through transformative physical environments. Here is how Impact Makers Events turns bold concepts into tangible spatial reality.",
    category: "spatial",
    categoryLabel: "Spatial Architecture",
    categoryColor: "blue",
    tags: ["Brand Activation", "Spatial Architecture", "Exhibition Stands", "Turnkey Delivery"],
    readTime: "8 Min Read",
    date: "Aug 02, 2026",
    author: {
      name: "Tariq Al-Mansoor",
      role: "Managing Director & Founder",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Tariq leads Impact Makers Events L.L.C, delivering bespoke exhibition stands and large-scale event organization worldwide.",
    },
    heroImage: "/images/render2.webp",
    heroImageAlt: "Spatial exhibition pavilion render with illuminated architectural canopies",
    caption: "Custom 3D pavilion design engineered for global defense and technology summits.",
    editorialBadge: "COVER STORY // VOL. 04",
    metrics: { label: "Global Hubs", value: "9 Countries" },
    relatedSlugs: [
      "navigating-dwtc-dec-stand-guidelines",
      "in-house-cnc-joinery-vs-subcontracting",
      "curved-4k-led-and-concert-sound-in-pavilions",
    ],
    sections: [
      {
        id: "concept-to-reality",
        title: "From Concept to Reality: Crafting Spaces that Bring Brands to Life",
        level: 2,
        content: [
          "At Impact Makers Events, our motto 'From Concept to Reality' is more than a slogan—it is an engineered discipline. Every line sketched in 3D Max is backed by structural CNC joinery calculations, precise material selections, and turnkey on-site assembly.",
          "Whether building an interactive tech pavilion at DWTC or organizing an international government summit in Kigali or Geneva, we create spaces that foster high-value B2B relationships and elevate corporate stature.",
        ],
      },
    ],
  },
  "diplomatic-protocol-in-international-congresses": {
    slug: "diplomatic-protocol-in-international-congresses",
    title: "Diplomatic Protocol & Operational Command in International Congresses",
    subtitle:
      "Managing ministerial VIP ingress, multilingual simultaneous interpretation, and airtight security at world congresses.",
    excerpt:
      "Organizing large-scale summits like the Universal Postal Congress requires uncompromising protocol adherence, bilateral lounges, and multi-language audio.",
    category: "event-organizing",
    categoryLabel: "Event Organizing",
    categoryColor: "indigo",
    tags: ["Congress Organizing", "Diplomatic Protocol", "Simultaneous Interpretation", "VIP Security"],
    readTime: "6 Min Read",
    date: "Jul 28, 2026",
    author: {
      name: "Amira Benali",
      role: "Head of Event Protocol & Operations",
      avatar: "/images/team/aurelia-dubois.jpg",
      bio: "Amira directs VIP protocol, ministerial delegations, and master show calling for large-scale international congresses.",
    },
    heroImage: "/images/executive-pavilion.jpg",
    heroImageAlt: "Diplomatic congress plenary hall with simultaneous interpretation headsets",
    caption: "Bilateral delegation meeting suite configured for head-of-state diplomatic discussions.",
    editorialBadge: "CONGRESS PROTOCOL",
    metrics: { label: "Languages", value: "8+ Live" },
    relatedSlugs: [
      "triple-iso-standards-in-event-management",
      "the-architecture-of-awe",
      "exhibition-space-selling-playbook",
    ],
    sections: [
      {
        id: "protocol-framework",
        title: "The Art of Diplomatic Protocol at World Congresses",
        level: 2,
        content: [
          "When hosting international congresses with heads of state and ministers, protocol precision is paramount. Seating hierarchy, motorcade ingress, and bilateral meeting rooms must adhere to strict diplomatic conventions.",
          "Our event organizing division provides turnkey congress management—from delegate registration and badge encryption to Bosch infrared simultaneous interpretation systems supporting up to 32 languages.",
        ],
      },
    ],
  },
  "exhibition-space-selling-playbook": {
    slug: "exhibition-space-selling-playbook",
    title: "Exhibition Space Selling: Monetizing Floor Plans & Global Sponsor Packaging",
    subtitle:
      "Strategic methodologies for exhibition organizers to recruit premium international exhibitors, optimize booth yield, and maximize sponsorship revenue.",
    excerpt:
      "How our commercial exhibition division partners with trade show organizers to sell out exhibition floor plans and secure high-value brand sponsorships.",
    category: "commercial",
    categoryLabel: "Space Selling",
    categoryColor: "slate",
    tags: ["Space Selling", "Floor Plan Monetization", "Sponsorship Packaging", "Exhibitor Recruitment"],
    readTime: "7 Min Read",
    date: "Jul 18, 2026",
    author: {
      name: "Marcus Sterling",
      role: "Commercial Director",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Marcus directs global exhibition space sales, floor plan yield management, and corporate sponsorship programs.",
    },
    heroImage: "/images/prev/booth_1.webp",
    heroImageAlt: "Exhibition floor plan sales and commercial pavilion layout",
    caption: "Strategic floor plan zoning maximizing foot traffic past premium anchor sponsor pavilions.",
    editorialBadge: "COMMERCIAL PLAYBOOK",
    metrics: { label: "Floor Plan Yield", value: "+40%" },
    relatedSlugs: [
      "navigating-dwtc-dec-stand-guidelines",
      "diplomatic-protocol-in-international-congresses",
      "the-architecture-of-awe",
    ],
    sections: [
      {
        id: "space-selling-strategy",
        title: "Maximizing Square Meter Yield and Sponsor Engagement",
        level: 2,
        content: [
          "A successful exhibition requires an engaging floor plan and a proactive international sales force. Our commercial division works alongside trade show organizers to identify key industry anchors, package bespoke sponsorship opportunities, and sell booth spaces across 9 international hubs.",
        ],
      },
    ],
  },
};

export function parseMarkdownSections(content: string): ArticleSection[] {
  if (!content) return [];
  const rawSections = content.split(/(?=^##\s+)/m);
  const sections: ArticleSection[] = [];

  for (let i = 0; i < rawSections.length; i++) {
    const raw = rawSections[i].trim();
    if (!raw) continue;

    if (raw.startsWith("## ")) {
      const firstLineEnd = raw.indexOf("\n");
      const title = firstLineEnd === -1 ? raw.replace("## ", "").trim() : raw.slice(3, firstLineEnd).trim();
      const body = firstLineEnd === -1 ? "" : raw.slice(firstLineEnd).trim();
      const paragraphs = body
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      sections.push({
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || `section-${i}`,
        title,
        level: 2,
        content: paragraphs.length > 0 ? paragraphs : [body],
      });
    } else {
      const paragraphs = raw
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      sections.push({
        id: `overview-${i}`,
        title: "Executive Overview",
        level: 2,
        content: paragraphs,
      });
    }
  }

  if (sections.length === 0) {
    sections.push({
      id: "overview",
      title: "Executive Overview",
      level: 2,
      content: [content],
    });
  }

  return sections;
}

export function mapPrismaToDetailedBlogPost(dbPost: any): DetailedBlogPost {
  const category = dbPost.category || "Stand Fabrication";
  let categoryColor = "blue";
  if (category.toLowerCase().includes("event")) categoryColor = "emerald";
  else if (category.toLowerCase().includes("av") || category.toLowerCase().includes("production")) categoryColor = "indigo";
  else if (category.toLowerCase().includes("guideline") || category.toLowerCase().includes("dwtc")) categoryColor = "amber";

  const authorName = dbPost.author?.name || "Tariq Al-Mansoor";
  const tags = Array.isArray(dbPost.tags) ? (dbPost.tags as string[]) : [];

  return {
    slug: dbPost.slug,
    title: dbPost.title,
    subtitle: dbPost.excerpt,
    excerpt: dbPost.excerpt,
    category: dbPost.category,
    categoryLabel: dbPost.category,
    categoryColor,
    tags: tags.length > 0 ? tags : [dbPost.category],
    readTime: dbPost.readingTime || "6 Min Read",
    date: new Date(dbPost.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    author: {
      name: authorName,
      role: dbPost.author?.role === "ADMIN" ? "Managing Director & Founder" : "Senior Event Director",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Impact Makers Events executive leadership and editorial contributor.",
    },
    heroImage: dbPost.coverImage || "/images/prev/booth_1.webp",
    heroImageAlt: dbPost.title,
    sections: parseMarkdownSections(dbPost.content),
    relatedSlugs: ["navigating-dwtc-dec-stand-guidelines", "in-house-cnc-joinery-vs-subcontracting"],
  };
}

export function getBlogPostBySlug(slug: string): DetailedBlogPost | undefined {
  return DETAILED_BLOG_POSTS[slug];
}

export function getAllBlogSlugs(): string[] {
  return Object.keys(DETAILED_BLOG_POSTS);
}
