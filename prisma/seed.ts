import { PrismaClient, Role, ContactStatus, BriefStatus, SubscriberStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DETAILED_BLOG_POSTS } from "../lib/blog-posts";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Hash default passwords
  const adminPasswordHash = await bcrypt.hash("ImpactAdmin2026!", 10);
  const salesPasswordHash = await bcrypt.hash("ImpactSales2026!", 10);

  // 2. Create or upsert Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@impactmakersevents.com" },
    update: {
      name: "Impact Executive Admin",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
    create: {
      name: "Impact Executive Admin",
      email: "admin@impactmakersevents.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  // 3. Create or upsert Sales User
  const salesUser = await prisma.user.upsert({
    where: { email: "sales@impactmakersevents.com" },
    update: {
      name: "Tariq Al-Mansoor (Senior Sales Director)",
      role: Role.SALES,
      passwordHash: salesPasswordHash,
    },
    create: {
      name: "Tariq Al-Mansoor (Senior Sales Director)",
      email: "sales@impactmakersevents.com",
      passwordHash: salesPasswordHash,
      role: Role.SALES,
    },
  });

  console.log(`Created users: Admin (${adminUser.email}) and Sales (${salesUser.email})`);

  // 4. Seed initial Blog Posts from lib/blog-posts.ts
  const postsList = Object.values(DETAILED_BLOG_POSTS);
  for (const post of postsList) {
    const sectionContents = post.sections.map((s) => `## ${s.title}\n\n${s.content.join("\n\n")}`).join("\n\n");
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: sectionContents,
        coverImage: post.heroImage,
        category: post.categoryLabel || post.category,
        tags: post.tags,
        readingTime: post.readTime,
        published: true,
        authorId: adminUser.id,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: sectionContents,
        coverImage: post.heroImage,
        category: post.categoryLabel || post.category,
        tags: post.tags,
        readingTime: post.readTime,
        published: true,
        authorId: adminUser.id,
      },
    });
  }
  console.log(`Seeded ${postsList.length} blog posts.`);

  // 5. Seed sample Contact Inquiries
  const sampleContacts = [
    {
      name: "Sarah Jenkins",
      email: "s.jenkins@apexglobal.co.uk",
      phone: "+44 20 7946 0921",
      subject: "GITEX Global 2026 2-Storey Stand RFP",
      message: "We require a turnkey double-decker pavilion at Dubai World Trade Centre. Please provide portfolio and schedule a preliminary video conference.",
      status: ContactStatus.NEW,
    },
    {
      name: "Dr. Marcus Vance",
      email: "marcus.v@biotech-congress.org",
      phone: "+49 30 2312 4589",
      subject: "International Medical Congress AV & Stage Rigging",
      message: "Organizing a 3-day medical summit in Dubai. Need 4K curved LED walls, simultaneous translation booths, and acoustic audio.",
      status: ContactStatus.CONTACTED,
    },
  ];

  for (const contact of sampleContacts) {
    const existing = await prisma.contactInquiry.findFirst({ where: { email: contact.email } });
    if (!existing) {
      await prisma.contactInquiry.create({ data: contact });
    }
  }

  // 6. Seed sample Stand Briefs
  const sampleBrief = {
    referenceCode: "SB-2026-849201",
    status: BriefStatus.IN_REVIEW,
    eventName: "GITEX GLOBAL 2026 (DWTC)",
    companyName: "Hyperion Quantum Technologies",
    contactPerson: "Elena Rostova",
    contactNumber: "+971 50 123 4567",
    email: "elena@hyperion-quantum.io",
    website: "https://hyperion-quantum.io",
    standLocation: "Hall 2, Stand H2-B40 (Dubai World Trade Centre)",
    standSize: "12m x 10m (120 sqm)",
    standType: "Island (4-Sided Open)",
    floorPlanUrl: "/uploads/sample-floorplan.pdf",
    primaryGoals: ["Product Launch", "Meeting", "Product Presentation"],
    otherGoalDetails: "Live executive streaming stage for global media announcements",
    colorScheme: "Corporate Navy & Electric Cyan (Pantone 293C / 3005C)",
    currency: "USD",
    budget: "185,000",
    productsDescription: "Quantum encrypted networking servers, rack demonstrators, and holographic holographic presentation pods.",
    productFiles: [
      { id: "file-1", name: "Quantum_Pod_Tech_Specs.pdf", size: "4.2 MB", type: "application/pdf" }
    ],
    displayItems: {
      receptionDesk: true,
      receptionDeskQty: 2,
      displayPodium: true,
      displayPodiumQty: 4,
      displayShowcase: true,
      displayShowcaseQty: 2,
      workstation: true,
      workstationQty: 6,
    },
    meetingAreaType: "Private",
    meetingCapacity: "12 - 16 VIPs",
    otherMeetingDetails: "Acoustic insulated frosted glass meeting suite with smart TV and integrated credenza.",
    additionalMeetingNotes: "Requires executive espresso bar and lockable storage.",
    aboveStandOptions: {
      trussTraverse: true,
      aboveStandOther: "Suspended circular LED ring banner 6m diameter",
    },
    carpetColor: "Charcoal Grey Heavy-Duty Exhibition Velour",
    flooringOption: "Elevated 100mm platform with perimeter LED halo lighting",
    storeRoomSize: "3m x 2m lockable room",
    storeRoomNotes: "Fitted with shelving and refrigerated catering prep unit",
    ledScreenQty: 2,
    ledScreenSize: "P2.6 High-Definition 6m x 3.5m Main Curved Wall",
    venueServices: {
      wifiInternet: true,
      logisticsForklift: true,
      eventConferenceSupport: true,
    },
    avAdditionalNotes: "Concealed cable raceways, master Crestron control tablet.",
    specialRequirements: {
      standPersonnel: true,
      marketingMaterials: false,
      travelAccommodation: false,
    },
    additionalComments: "Move-in date scheduled for 4 days before show opening.",
    internalNotes: [
      {
        id: "note-1",
        text: "Client requested 3D render preview by next Tuesday. Assigned to Senior 3D Designer.",
        authorName: "Impact Executive Admin",
        authorRole: "ADMIN",
        createdAt: new Date().toISOString(),
      }
    ],
    assignedSalesId: salesUser.id,
  };

  const existingBrief = await prisma.standBrief.findUnique({ where: { referenceCode: sampleBrief.referenceCode } });
  if (!existingBrief) {
    await prisma.standBrief.create({ data: sampleBrief });
  }

  // 7. Seed Newsletter Subscribers
  const sampleSubscribers = [
    { email: "director@global-events-summit.com", status: SubscriberStatus.ACTIVE, topics: ["Spatial Architecture", "Show Automation & Rigging"] },
    { email: "marketing@technovate-expo.de", status: SubscriberStatus.ACTIVE, topics: ["DWTC Guidelines"] },
  ];

  for (const sub of sampleSubscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: sub.email },
      update: {},
      create: sub,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
