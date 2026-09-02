import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { standBriefSchema } from "@/lib/standBriefSchema";
import { sendStandBriefNotification } from "@/lib/email";

function generateReferenceCode(): string {
  const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
  const year = new Date().getFullYear();
  return `SB-${year}-${randomSixDigit}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = standBriefSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation error in Stand Brief submission",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;
    const refCode = generateReferenceCode();

    // Map display and reception items into JSON structure
    const displayItemsJson = {
      receptionDesk: data.step3.receptionDesk,
      receptionDeskQty: data.step3.receptionDeskQty,
      brochureHolder: data.step3.brochureHolder,
      brochureHolderQty: data.step3.brochureHolderQty,
      displayShelf: data.step3.displayShelf,
      displayShelfQty: data.step3.displayShelfQty,
      displayPodium: data.step3.displayPodium,
      displayPodiumQty: data.step3.displayPodiumQty,
      displayShowcase: data.step3.displayShowcase,
      displayShowcaseQty: data.step3.displayShowcaseQty,
      workstation: data.step3.workstation,
      workstationQty: data.step3.workstationQty,
    };

    const aboveStandJson = {
      trussTraverse: data.step4.trussTraverse,
      aboveStandOther: data.step4.aboveStandOther,
    };

    const venueServicesJson = {
      wifiInternet: data.step5.wifiInternet,
      logisticsForklift: data.step5.logisticsForklift,
      eventConferenceSupport: data.step5.eventConferenceSupport,
    };

    const specialReqJson = {
      standPersonnel: data.step6.standPersonnel,
      marketingMaterials: data.step6.marketingMaterials,
      travelAccommodation: data.step6.travelAccommodation,
    };

    const brief = await prisma.standBrief.create({
      data: {
        referenceCode: refCode,
        status: "SUBMITTED",
        // Step 1
        eventName: data.step1.eventName,
        companyName: data.step1.companyName,
        contactPerson: data.step1.contactPerson,
        contactNumber: data.step1.contactNumber,
        email: data.step1.email.toLowerCase().trim(),
        website: data.step1.website || null,
        standLocation: data.step1.standLocation,
        standSize: data.step1.standSize,
        standType: data.step1.standType,
        floorPlanUrl: data.step1.floorPlanUrl || data.step1.floorPlanName || null,
        // Step 2
        primaryGoals: data.step2.primaryGoals,
        otherGoalDetails: data.step2.otherGoalDetails || null,
        colorScheme: data.step2.preferredColorScheme,
        currency: data.step2.budgetCurrency,
        budget: data.step2.budgetAmount,
        productsDescription: data.step2.productsToExhibit,
        productFiles: data.step2.productFiles as any,
        // Step 3
        displayItems: displayItemsJson,
        meetingAreaType: data.step3.meetingAreaType,
        meetingCapacity: data.step3.seatingCapacity || null,
        otherMeetingDetails: data.step3.otherMeetingDetails || null,
        additionalMeetingNotes: data.step3.additionalMeetingNotes || null,
        // Step 4
        aboveStandOptions: aboveStandJson,
        carpetColor: data.step4.carpetColor || null,
        flooringOption: data.step4.flooringOther || null,
        storeRoomSize: data.step4.storeRoom2x2 ? "Standard 2m x 2m" : "None",
        storeRoomNotes: data.step4.storeRoomOther || null,
        // Step 5
        ledScreenQty: data.step5.ledScreenQty,
        ledScreenSize: data.step5.ledScreenSize,
        venueServices: venueServicesJson,
        avAdditionalNotes: data.step5.avAdditionalNotes || null,
        // Step 6
        specialRequirements: specialReqJson,
        additionalComments: data.step6.additionalComments || null,
        internalNotes: [],
      },
    });

    // Fire email alert asynchronously
    sendStandBriefNotification({
      referenceCode: brief.referenceCode,
      companyName: brief.companyName,
      contactPerson: brief.contactPerson,
      email: brief.email,
      contactNumber: brief.contactNumber,
      standSize: brief.standSize,
      standType: brief.standType,
      budget: brief.budget,
      currency: brief.currency,
    }).catch((err) => console.error("[Stand Brief Notification Error]", err));

    return NextResponse.json(
      {
        success: true,
        referenceCode: brief.referenceCode,
        id: brief.id,
        message: "Stand Architecture Brief registered successfully.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/stand-brief Error]", err);
    return NextResponse.json(
      { error: "Failed to record stand brief. Please try again." },
      { status: 500 }
    );
  }
}
