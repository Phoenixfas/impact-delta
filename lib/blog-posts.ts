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
  "the-architecture-of-awe": {
    slug: "the-architecture-of-awe",
    title: "The Architecture of Awe: Engineering Stadium-Scale Kinetic Stages for 100,000+ Attendees",
    subtitle:
      "How real-time Unreal Engine previsualization, SMPTE fiber backbones, and 128 synchronized kinetic axes are redefining human connection at enterprise summits.",
    excerpt:
      "Enterprise summits have evolved from passive presentation halls into living spatial media ecosystems. Here is how we engineer sub-millisecond precision across stadium arenas.",
    category: "spatial",
    categoryLabel: "Spatial Architecture",
    categoryColor: "blue",
    tags: ["Kinetic Rigging", "Spatial Previz", "SMPTE", "Show Control", "Stadium Scale"],
    readTime: "8 Min Read",
    date: "Aug 24, 2026",
    updatedDate: "Aug 26, 2026",
    author: {
      name: "Marcus Chen",
      role: "VP of Spatial Architecture",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Marcus leads spatial architecture and kinetic rigging systems at Impact B2B, having directed over 120 global arena summit builds.",
    },
    heroImage: "/images/summit-keynote.jpg",
    heroImageAlt: "Stadium scale keynote arena engineered with synchronized kinetic lighting arrays",
    caption: "The 360° kinetic centerpiece at World Tech Summit Tokyo 2026, synchronized across 128 variable-speed winches.",
    editorialBadge: "COVER STORY // VOL. 04",
    metrics: { label: "Synchronized Axes", value: "128" },
    relatedSlugs: [
      "kinetic-truss-rigging",
      "unreal-engine-previz",
      "spatial-audio-sculpting",
    ],
    sections: [
      {
        id: "paradigm-shift",
        title: "The Paradigm Shift: From Proscenium to Kinetic Volumetrics",
        level: 2,
        content: [
          "For decades, the standard enterprise keynote adhered strictly to a traditional 16:9 proscenium frame: a flat stage, a pair of projection screens, and static front-of-house lighting. However, in an era where executive delegates crave immersive physical presence, static geometry no longer commands human attention.",
          "At Impact B2B, our spatial lab approaches event staging as architectural motion. By treating the entire arena volume as an interactive canvas—incorporating motorized LED blades, fluid volumetric light curtains, and sub-millisecond spatial audio—we transform passive audiences into active participants in a collective physical experience.",
        ],
        callout: {
          type: "blueprint",
          title: "Core Architectural Principle",
          text: "When structural movement directly mirrors emotional narrative peaks in an executive keynote, audience memory retention jumps by 68% compared to static LED backdrop presentations.",
          meta: "Source: Impact Spatial Cognition Labs, 2026",
        },
      },
      {
        id: "fiber-backbone",
        title: "Zero-Fail Sub-Millisecond SMPTE Fiber Infrastructure",
        level: 2,
        content: [
          "The physical scale of modern stadium venues introduces strict physics limitations. In an arena spanning 180 meters across, copper DMX lines suffer from signal degradation and catastrophic latency jitter. To coordinate 128 variable-speed kinetic winches, primary media servers, and laser arrays, we rely exclusively on dual-ring redundant optical fiber backbones.",
          "Each kinetic node communicates via isolated SMPTE ST 2110 IP networks. If a primary fiber trunk is severed or damaged during show setup, our automatic optical bypass switches fail over to the secondary line in under 0.2 milliseconds—well below human perceptual thresholds.",
        ],
      },
      {
        id: "realtime-previz",
        title: "Unreal Engine 5: The Pre-Load-In Validation Pipeline",
        level: 3,
        content: [
          "On-site venue time is the most expensive variable in summit production. Every hour spent diagnosing sightlines or collision boundaries on-site costs tens of thousands of dollars. We run a 1:1 photorealistic digital twin in Unreal Engine 5 months before physical steel is loaded into the arena.",
          "Using custom DMX-to-Unreal bridge plugins, show directors can run the entire 90-minute keynote choreography, verify laser safety zones, and evaluate attendee sightlines from any seat in the arena at native 120 FPS.",
        ],
        callout: {
          type: "telemetry",
          title: "Engineering Telemetry Specs",
          text: "Zero collision occurrences across 450+ summit builds. 99.999% SMPTE timecode sync accuracy with <0.08ms drift per 24-hour continuous show control cycle.",
        },
      },
      {
        id: "spatial-sound",
        title: "Acoustic Sculpting and Emotional Resonance",
        level: 2,
        content: [
          "Visual awe without acoustic intimacy results in cognitive fatigue. In cavernous 100,000-delegate stadiums, standard stereo PA systems produce unintelligible echoes and harsh high-frequency reflections. We implement 3D volumetric beamforming line arrays synchronized with localized seat transducers.",
          "This guarantees that whether a delegate is sitting front-row VIP or in the upper bowl tier, the keynote speaker's voice arrives with the crisp intimacy of an executive boardroom conversation.",
        ],
      },
      {
        id: "future-horizons",
        title: "The Horizon of Event Architecture",
        level: 2,
        content: [
          "As we look toward 2027 and beyond, the intersection of real-time generative neural graphics, kinetic robotics, and sustainable demountable structures will continue to redefine the landscape of global corporate summits.",
          "The enterprise brands that will dominate mindshare are those who understand that human awe is not accidental—it is engineered with sub-millisecond discipline, architectural audacity, and uncompromising reliability.",
        ],
      },
    ],
  },
  "kinetic-truss-rigging": {
    slug: "kinetic-truss-rigging",
    title: "Kinetic Truss Rigging: Redundant Fiber Backbones for 360° Volumetric Stages",
    subtitle:
      "A technical walkthrough of sub-millisecond SMPTE timecode routing, fail-safe optical networks, and multi-axis kinetic motor synchronization for stadium builds.",
    excerpt:
      "A technical walkthrough of sub-millisecond SMPTE timecode routing, fail-safe optical networks, and multi-axis kinetic motor synchronization for stadium builds.",
    category: "event-tech",
    categoryLabel: "Event Tech",
    categoryColor: "blue",
    tags: ["Rigging", "Show Control", "SMPTE", "Automation", "Motors"],
    readTime: "6 Min Read",
    date: "Aug 22, 2026",
    author: {
      name: "Marcus Chen",
      role: "VP of Spatial Architecture",
      avatar: "/images/team/marcus-chen.jpg",
      bio: "Marcus leads spatial architecture and kinetic rigging systems at Impact B2B.",
    },
    heroImage: "/images/kinetic-installation.jpg",
    heroImageAlt: "Kinetic lighting and structural rigging over stadium arena",
    caption: "Kinetic motor clusters suspended above the main presentation rotunda.",
    editorialBadge: "ENGINEERING BLUEPRINT",
    metrics: { label: "Latency", value: "<0.1ms" },
    relatedSlugs: [
      "the-architecture-of-awe",
      "unreal-engine-previz",
      "zero-fail-protocol",
    ],
    sections: [
      {
        id: "motor-synchronization",
        title: "Variable Speed Motor Protocols",
        level: 2,
        content: [
          "When lifting tons of fragile LED panels and lighting instruments directly above high-profile corporate delegates, precision is synonymous with safety.",
          "We utilize SIL-3 certified variable-speed chain hoists featuring dual independent electromagnetic brakes, absolute position rotary encoders, and real-time load-cell feedback.",
        ],
      },
      {
        id: "fail-safe-logic",
        title: "E-Stop Architecture & Fail-Safe Loops",
        level: 2,
        content: [
          "Our emergency stop loop operates on hardwired, closed-circuit safety relays completely decoupled from software operating systems. In the unlikely event of power fluctuations or sensor mismatch, hoists enter soft-deceleration lock within 12 milliseconds.",
        ],
      },
    ],
  },
  "haute-cuisine-at-scale": {
    slug: "haute-cuisine-at-scale",
    title: "Haute Cuisine at Scale: Michelin-Caliber Dinners for 5,000 Keynote Guests",
    subtitle:
      "Behind the curtain of high-throughput executive hospitality: architectural plating choreography, live temperature telemetry, and bespoke mixology.",
    excerpt:
      "Behind the curtain of high-throughput executive hospitality: architectural plating choreography, live temperature telemetry, and bespoke mixology.",
    category: "production-strategy",
    categoryLabel: "Production Strategy",
    categoryColor: "indigo",
    tags: ["Executive Hospitality", "VIP Dining", "Logistics", "Plating Operations"],
    readTime: "5 Min Read",
    date: "Aug 18, 2026",
    author: {
      name: "Aurelia Dubois",
      role: "Global Hospitality Director",
      avatar: "/images/team/aurelia-dubois.jpg",
      bio: "Aurelia directs luxury gastronomic programs for Fortune 50 summits and global state banquets.",
    },
    heroImage: "/images/executive-pavilion.jpg",
    heroImageAlt: "Executive dining pavilion with ambient warm lighting",
    caption: "Plating staging area configured for 5,000 simultaneous 4-course executive services.",
    editorialBadge: "EXECUTIVE INSIGHT",
    metrics: { label: "Plated / Hr", value: "5,000+" },
    relatedSlugs: [
      "the-architecture-of-awe",
      "sovereign-executive-lounge",
      "circular-event-architecture",
    ],
    sections: [
      {
        id: "culinary-logistics",
        title: "Synchronized Plating Choreography",
        level: 2,
        content: [
          "Serving 5,000 multi-course dinners within a tight 45-minute keynote window requires military-grade timing and culinary artistry.",
          "Our mobile induction warming stations and thermal RFID tray trackers ensure every dish reaches the guest table within 1.5°C of executive chef specification.",
        ],
      },
    ],
  },
  "unreal-engine-previz": {
    slug: "unreal-engine-previz",
    title: "Real-Time Unreal Engine Previz: Slashing On-Site Build Revisions by 74%",
    subtitle:
      "How millimeter-accurate 3D previz pipelines allow global brand architects to preview lighting, spatial acoustics, and attendee sightlines months before venue load-in.",
    excerpt:
      "How millimeter-accurate 3D previz pipelines allow global brand architects to preview lighting, spatial acoustics, and attendee sightlines months before venue load-in.",
    category: "event-tech",
    categoryLabel: "Event Tech",
    categoryColor: "sky",
    tags: ["Unreal Engine 5", "Previz", "3D Spatial", "Sightlines"],
    readTime: "7 Min Read",
    date: "Aug 14, 2026",
    author: {
      name: "Elena Vance",
      role: "Chief Technology Officer",
      avatar: "/images/team/elena-vance.jpg",
      bio: "Elena oversees real-time visualization, generative media servers, and software architecture.",
    },
    heroImage: "/images/render2.webp",
    heroImageAlt: "Unreal Engine 5 architectural previz render of summit stage",
    caption: "Real-time viewport preview of volumetric beam dispersion in Unreal Engine 5.4.",
    editorialBadge: "TECH BREAKTHROUGH",
    metrics: { label: "Revision Cut", value: "74%" },
    relatedSlugs: [
      "the-architecture-of-awe",
      "kinetic-truss-rigging",
      "spatial-audio-sculpting",
    ],
    sections: [
      {
        id: "previz-pipeline",
        title: "From CAD Architecture to Real-Time Render",
        level: 2,
        content: [
          "By feeding structural AutoCAD engineering drawings directly into Unreal Engine with custom DMX lighting profiles, clients experience their show months before breaking ground.",
        ],
      },
    ],
  },
  "circular-event-architecture": {
    slug: "circular-event-architecture",
    title: "Circular Event Architecture: 100% Recyclable Multi-Story Pavilions",
    subtitle:
      "Eliminating single-use waste in temporary structures through precision modular timber, demountable steel nodes, and closed-loop material passports.",
    excerpt:
      "Eliminating single-use waste in temporary structures through precision modular timber, demountable steel nodes, and closed-loop material passports.",
    category: "sustainable-events",
    categoryLabel: "Sustainable Events",
    categoryColor: "emerald",
    tags: ["Circular Economy", "LEED Platinum", "Modular Timber", "Zero-Waste"],
    readTime: "6 Min Read",
    date: "Aug 06, 2026",
    author: {
      name: "Siddharth Patel",
      role: "Head of Sustainable Infrastructure",
      avatar: "/images/team/siddharth-patel.jpg",
      bio: "Siddharth specializes in circular materials, net-zero venue logistics, and ISO 20121 certification.",
    },
    heroImage: "/images/prev/booth_1.webp",
    heroImageAlt: "Sustainable circular pavilion with architectural timber",
    caption: "Demountable cross-laminated timber pavilion assembled in 48 hours with zero drywall waste.",
    editorialBadge: "SUSTAINABILITY LAB",
    metrics: { label: "Recyclable", value: "100%" },
    relatedSlugs: [
      "the-architecture-of-awe",
      "haute-cuisine-at-scale",
      "decarbonizing-mega-summits",
    ],
    sections: [
      {
        id: "circular-timber",
        title: "Demountable Timber & Closed-Loop Passports",
        level: 2,
        content: [
          "Traditional trade show and summit builds generate metric tons of landfill waste per day. Our structural timber node system is fully demountable, reconfigurable, and 100% certified circular.",
        ],
      },
    ],
  },
  "spatial-audio-sculpting": {
    slug: "spatial-audio-sculpting",
    title: "Spatial Audio Sculpting: Creating Intimate Immersion in 80,000-Seat Arenas",
    subtitle:
      "How beamforming line arrays, acoustic volumetric modeling, and binaural headphone routing give stadium attendees front-row acoustic clarity.",
    excerpt:
      "How beamforming line arrays, acoustic volumetric modeling, and binaural headphone routing give stadium attendees front-row acoustic clarity.",
    category: "event-tech",
    categoryLabel: "Event Tech",
    categoryColor: "sky",
    tags: ["Spatial Audio", "Dolby Atmos", "Acoustics", "Beamforming"],
    readTime: "5 Min Read",
    date: "Jul 24, 2026",
    author: {
      name: "Elena Vance",
      role: "Chief Technology Officer",
      avatar: "/images/team/elena-vance.jpg",
      bio: "Elena oversees real-time visualization and spatial audio systems at Impact B2B.",
    },
    heroImage: "/images/kinetic-installation.jpg",
    heroImageAlt: "Spatial acoustic arrays positioned in modern arena",
    caption: "3D acoustic mapping calibrated for zero echo reflection across stadium tiers.",
    editorialBadge: "ACOUSTIC LAB",
    metrics: { label: "Clarity Index", value: "0.94 STI" },
    relatedSlugs: [
      "the-architecture-of-awe",
      "unreal-engine-previz",
      "kinetic-truss-rigging",
    ],
    sections: [
      {
        id: "beamforming",
        title: "Acoustic Beam Steering and Directivity",
        level: 2,
        content: [
          "Using precision FIR filters and steerable DSP arrays, we steer sound energy exclusively toward audience seating tiers while creating destructive interference nulls at reflective concrete domes.",
        ],
      },
    ],
  },
  "sovereign-executive-lounge": {
    slug: "sovereign-executive-lounge",
    title: "The Sovereign Executive Lounge: Private Diplomacy & VIP Security Architecture",
    subtitle:
      "Designing confidential bilateral meeting spaces within massive public convention centers: Faraday RF shielding, acoustic baffling, and discrete access corridors.",
    excerpt:
      "Designing confidential bilateral meeting spaces within massive public convention centers: Faraday RF shielding, acoustic baffling, and discrete access corridors.",
    category: "production-strategy",
    categoryLabel: "Production Strategy",
    categoryColor: "indigo",
    tags: ["Diplomacy", "VIP Security", "Faraday Shielding", "Acoustics"],
    readTime: "7 Min Read",
    date: "Jul 18, 2026",
    author: {
      name: "David Thorne",
      role: "Director of Technical Production",
      avatar: "/images/team/david-thorne.jpg",
      bio: "David directs high-security infrastructure, government delegation safety, and technical logistics.",
    },
    heroImage: "/images/executive-pavilion.jpg",
    heroImageAlt: "Sovereign executive lounge with privacy acoustic screening",
    caption: "Faraday-shielded executive salon built inside London ExCeL Arena.",
    editorialBadge: "SECURITY & DESIGN",
    metrics: { label: "Acoustic Attenuation", value: "-45 dB" },
    relatedSlugs: [
      "haute-cuisine-at-scale",
      "the-architecture-of-awe",
      "zero-fail-protocol",
    ],
    sections: [
      {
        id: "rf-shielding",
        title: "Faraday RF Attenuation & Speech Privacy",
        level: 2,
        content: [
          "Bilateral diplomacy and C-suite acquisitions during major summits demand zero acoustic eavesdropping and RF signal shielding. We integrate copper-mesh composite wall assemblies providing -45 dB acoustic isolation.",
        ],
      },
    ],
  },
  "zero-fail-protocol": {
    slug: "zero-fail-protocol",
    title: "The Zero-Fail Protocol: Multi-Region Microgrids & Satellite Uplinks",
    subtitle:
      "Enterprise summits cannot tolerate a single black frame. Our ISO-certified framework for N+2 power redundancy and automatic satellite-to-terrestrial failovers.",
    excerpt:
      "Enterprise summits cannot tolerate a single black frame. Our ISO-certified framework for N+2 power redundancy and automatic satellite-to-terrestrial failovers.",
    category: "production-strategy",
    categoryLabel: "Production Strategy",
    categoryColor: "slate",
    tags: ["Redundancy", "Command Control", "Clean Microgrids", "ISO 45001"],
    readTime: "9 Min Read",
    date: "Aug 10, 2026",
    author: {
      name: "David Thorne",
      role: "Director of Technical Production",
      avatar: "/images/team/david-thorne.jpg",
      bio: "David directs high-security infrastructure and technical logistics.",
    },
    heroImage: "/images/summit-keynote.jpg",
    heroImageAlt: "Command control room overlooking keynote arena",
    caption: "The mobile command center monitoring 500+ telemetry points in real time.",
    editorialBadge: "GOVERNANCE & SAFETY",
    metrics: { label: "Power Uptime", value: "99.999%" },
    relatedSlugs: [
      "the-architecture-of-awe",
      "kinetic-truss-rigging",
      "sovereign-executive-lounge",
    ],
    sections: [
      {
        id: "power-redundancy",
        title: "N+2 Microgrid Architecture",
        level: 2,
        content: [
          "Every essential subsystem—from stage lighting servers to broadcast encoding engines—draws from dual independent UPS battery banks backed by synchronized Tier-4 biofuel generators.",
        ],
      },
    ],
  },
  "decarbonizing-mega-summits": {
    slug: "decarbonizing-mega-summits",
    title: "Decarbonizing Mega-Summits: Microgrids, Biofuel Generators & Scope 3 Tracking",
    subtitle:
      "A complete operational guide for enterprise sustainability leads to calculate, reduce, and verify real-time carbon offsets at massive global conferences.",
    excerpt:
      "A complete operational guide for enterprise sustainability leads to calculate, reduce, and verify real-time carbon offsets at massive global conferences.",
    category: "sustainable-events",
    categoryLabel: "Sustainable Events",
    categoryColor: "emerald",
    tags: ["Clean Energy", "Scope 3", "Biofuel", "Carbon Accounting"],
    readTime: "8 Min Read",
    date: "Jul 12, 2026",
    author: {
      name: "Siddharth Patel",
      role: "Head of Sustainable Infrastructure",
      avatar: "/images/team/siddharth-patel.jpg",
      bio: "Siddharth specializes in circular materials and net-zero venue logistics.",
    },
    heroImage: "/images/summit-keynote.jpg",
    heroImageAlt: "Low-emission green power grid distribution for large-scale summit",
    caption: "Real-time energy consumption telemetry dashboard deployed at Munich Expo 2026.",
    editorialBadge: "ESG DIRECTIVE",
    metrics: { label: "Carbon Reduction", value: "-68%" },
    relatedSlugs: [
      "circular-event-architecture",
      "the-architecture-of-awe",
      "haute-cuisine-at-scale",
    ],
    sections: [
      {
        id: "carbon-tracking",
        title: "Live Carbon Telemetry & Microgrids",
        level: 2,
        content: [
          "By deploying IoT power clamp meters across all exhibition halls and kitchens, we calculate real-time kilowatt-hour emissions and dynamically adjust HVAC loads.",
        ],
      },
    ],
  },
};

export function getBlogPostBySlug(slug: string): DetailedBlogPost | undefined {
  return DETAILED_BLOG_POSTS[slug] || DETAILED_BLOG_POSTS["the-architecture-of-awe"];
}

export function getAllBlogSlugs(): string[] {
  return Object.keys(DETAILED_BLOG_POSTS);
}
