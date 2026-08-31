import { z } from "zod";

export const STAND_TYPES = [
  {
    id: "Peninsula",
    label: "Peninsula Stand",
    sides: "3 Open Sides",
    description: "High visibility end-cap facing 3 aisles",
    badge: "3-Sided",
  },
  {
    id: "Island",
    label: "Island Stand",
    sides: "4 Open Sides",
    description: "360° unobstructed walkthrough pavilion",
    badge: "4-Sided",
  },
  {
    id: "Corner",
    label: "Corner Stand",
    sides: "2 Open Sides",
    description: "Corner placement at aisle intersection",
    badge: "2-Sided",
  },
  {
    id: "Row",
    label: "Row / Inline Stand",
    sides: "1 Open Side",
    description: "Standard front-facing single aisle frontage",
    badge: "1-Sided",
  },
  {
    id: "Multi-Story",
    label: "Multi-Story / Double Decker",
    sides: "Elevated Tier",
    description: "Two-level structural architecture with VIP mezzanine",
    badge: "Double Deck",
  },
] as const;

export const PRIMARY_GOALS_LIST = [
  {
    id: "Product Presentation",
    label: "Product Presentation",
    desc: "Interactive demo pedestals, displays & showcase zones",
    badge: "Showcase",
  },
  {
    id: "Meeting",
    label: "Meeting & VIP Lounge",
    desc: "Executive dealmaking, private lounges & consultation suites",
    badge: "Networking",
  },
  {
    id: "Product Launch",
    label: "Product Launch",
    desc: "High-impact keynote presentation stage & reveal spectacle",
    badge: "Keynote / Launch",
  },
  {
    id: "Others",
    label: "Others / Custom",
    desc: "Tailored brand immersion, experiential gaming & hospitality",
    badge: "Custom",
  },
] as const;

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "AED", symbol: "AED", label: "AED (د.إ)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
] as const;

export const DISPLAY_RECEPTION_ITEMS = [
  {
    id: "receptionDesk" as const,
    qtyKey: "receptionDeskQty" as const,
    label: "Reception Desk",
    desc: "Front entrance welcoming counter with lockable cabinet & brand lighting",
    badge: "Front Desk",
    defaultQty: 1,
    minQty: 1,
    maxQty: 4,
  },
  {
    id: "brochureHolder" as const,
    qtyKey: "brochureHolderQty" as const,
    label: "Brochure Holder",
    desc: "Freestanding or counter-mounted multi-tier literature & catalog racks",
    badge: "Literature",
    defaultQty: 2,
    minQty: 1,
    maxQty: 8,
  },
  {
    id: "displayShelf" as const,
    qtyKey: "displayShelfQty" as const,
    label: "Display Shelf",
    desc: "Backlit perimeter wall shelving units with integrated LED spotlights",
    badge: "Wall Shelving",
    defaultQty: 3,
    minQty: 1,
    maxQty: 12,
  },
  {
    id: "displayPodium" as const,
    qtyKey: "displayPodiumQty" as const,
    label: "Display Podium",
    desc: "Elevated hero pedestals for physical products & centerpiece models",
    badge: "Pedestal",
    defaultQty: 2,
    minQty: 1,
    maxQty: 10,
  },
  {
    id: "displayShowcase" as const,
    qtyKey: "displayShowcaseQty" as const,
    label: "Display Showcase",
    desc: "Lockable tempered glass display vitrines with anti-glare illumination",
    badge: "Glass Vitrine",
    defaultQty: 1,
    minQty: 1,
    maxQty: 6,
  },
  {
    id: "workstation" as const,
    qtyKey: "workstationQty" as const,
    label: "Workstation",
    desc: "Interactive demo terminals, high bar stools & laptop presentation pods",
    badge: "Demo Pod",
    defaultQty: 2,
    minQty: 1,
    maxQty: 8,
  },
] as const;

export const MEETING_AREA_TYPES = [
  {
    id: "Private",
    label: "Private Meeting Room",
    badge: "Acoustic Sealed",
    desc: "Enclosed executive boardroom with sound isolation & lockable glass doors",
  },
  {
    id: "Open",
    label: "Open Lounge Area",
    badge: "Casual & Accessible",
    desc: "Inviting open seating with designer armchairs, low coffee tables & barstools",
  },
  {
    id: "Other",
    label: "Other / Custom Hybrid",
    badge: "Bespoke Layout",
    desc: "Semi-private acoustic pods, elevated mezzanine VIP deck, or booth clusters",
  },
] as const;

export const step1Schema = z.object({
  eventName: z.string().min(2, "Event or exhibition name is required"),
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  contactNumber: z.string().min(5, "Contact number is required"),
  email: z.string().email("Please enter a valid work email"),
  website: z.string(),
  standLocation: z.string().min(2, "Stand location is required (e.g. Hall 3, Booth A12)"),
  standSize: z.string().min(2, "Stand size is required (e.g. 3m x 6m)"),
  standType: z.string().min(1, "Please select a stand layout type"),
  floorPlanName: z.string(),
  floorPlanSize: z.string(),
});

export const uploadedFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.string(),
  type: z.string(),
  preview: z.string().optional(),
});

export type UploadedFile = z.infer<typeof uploadedFileSchema>;

export const step2Schema = z.object({
  primaryGoals: z.array(z.string()).min(1, "Please select at least one primary aim or goal"),
  otherGoalDetails: z.string(),
  preferredColorScheme: z.string().min(2, "Preferred colour scheme is required"),
  colorHex: z.string(),
  budgetCurrency: z.string().min(1, "Currency is required"),
  budgetAmount: z.string().min(1, "Allocated budget amount is required"),
  productsToExhibit: z.string().min(5, "Please describe the products or services to exhibit"),
  productFiles: z.array(uploadedFileSchema),
});

export const step3Schema = z.object({
  receptionDesk: z.boolean(),
  receptionDeskQty: z.number(),
  brochureHolder: z.boolean(),
  brochureHolderQty: z.number(),
  displayShelf: z.boolean(),
  displayShelfQty: z.number(),
  displayPodium: z.boolean(),
  displayPodiumQty: z.number(),
  displayShowcase: z.boolean(),
  displayShowcaseQty: z.number(),
  workstation: z.boolean(),
  workstationQty: z.number(),
  meetingAreaType: z.string().min(1, "Please select a meeting area type"),
  otherMeetingDetails: z.string(),
  seatingCapacity: z.string(),
  additionalMeetingNotes: z.string(),
});

export const step4Schema = z.object({
  trussTraverse: z.boolean(),
  aboveStandOther: z.string(),
  carpetColor: z.string(),
  carpetColorHex: z.string(),
  flooringOther: z.string(),
  storeRoom2x2: z.boolean(),
  storeRoomOther: z.string(),
});

export const step5Schema = z.object({
  ledScreenQty: z.number(),
  ledScreenSize: z.string().min(1, "LED screen specification is required"),
  wifiInternet: z.boolean(),
  logisticsForklift: z.boolean(),
  eventConferenceSupport: z.boolean(),
  avAdditionalNotes: z.string(),
});

export const step6Schema = z.object({
  standPersonnel: z.boolean(),
  marketingMaterials: z.boolean(),
  travelAccommodation: z.boolean(),
  additionalComments: z.string(),
});

export const standBriefSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
  step6: step6Schema,
});

export type StandBriefFormData = z.infer<typeof standBriefSchema>;

export const DEFAULT_BRIEF_VALUES: StandBriefFormData = {
  step1: {
    eventName: "",
    companyName: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    website: "",
    standLocation: "",
    standSize: "",
    standType: "",
    floorPlanName: "",
    floorPlanSize: "",
  },
  step2: {
    primaryGoals: ["Product Presentation"],
    otherGoalDetails: "",
    preferredColorScheme: "Corporate Deep Blue & Pure White",
    colorHex: "#003E95",
    budgetCurrency: "USD",
    budgetAmount: "",
    productsToExhibit: "",
    productFiles: [],
  },
  step3: {
    receptionDesk: true,
    receptionDeskQty: 1,
    brochureHolder: false,
    brochureHolderQty: 2,
    displayShelf: false,
    displayShelfQty: 3,
    displayPodium: false,
    displayPodiumQty: 2,
    displayShowcase: false,
    displayShowcaseQty: 1,
    workstation: false,
    workstationQty: 2,
    meetingAreaType: "Open",
    otherMeetingDetails: "",
    seatingCapacity: "4-6 persons",
    additionalMeetingNotes: "",
  },
  step4: {
    trussTraverse: true,
    aboveStandOther: "",
    carpetColor: "Impact Corporate Blue",
    carpetColorHex: "#003E95",
    flooringOther: "",
    storeRoom2x2: true,
    storeRoomOther: "",
  },
  step5: {
    ledScreenQty: 1,
    ledScreenSize: '65" Commercial 4K Display',
    wifiInternet: true,
    logisticsForklift: false,
    eventConferenceSupport: true,
    avAdditionalNotes: "",
  },
  step6: {
    standPersonnel: false,
    marketingMaterials: true,
    travelAccommodation: false,
    additionalComments: "",
  },
};

export interface StepDefinition {
  id: number;
  number: string;
  name: string;
  key: keyof StandBriefFormData;
  shortDesc: string;
}

export const STEPS: readonly StepDefinition[] = [
  { id: 1, number: "01", name: "Company Details", key: "step1", shortDesc: "Client & Stand Specs" },
  { id: 2, number: "02", name: "Stand Brief", key: "step2", shortDesc: "Aims, Budget & Products" },
  { id: 3, number: "03", name: "Display & Meeting", key: "step3", shortDesc: "Display & Meeting Area" },
  { id: 4, number: "04", name: "Stand Design", key: "step4", shortDesc: "Rigging, Flooring & Storage" },
  { id: 5, number: "05", name: "Audio Visual", key: "step5", shortDesc: "LED Screens & Venue Services" },
  { id: 6, number: "06", name: "Additional Requirements", key: "step6", shortDesc: "Staff, Printing & Submit" },
] as const;
