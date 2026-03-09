import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.email || !body.phone || !body.businessName || !body.idFileUrl || !body.businessCategory) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Save to Supabase
        const { data, error } = await supabase
            .from('StudentPitch')
            .insert([
                {
                    name: body.name,
                    age: body.age,
                    city: body.city,
                    college: body.college,
                    email: body.email,
                    phone: body.phone,
                    idProofUrl: body.idFileUrl,
                    businessName: body.businessName,
                    businessCategory: body.businessCategory,
                    capital: body.capitalRequired, // Map back to DB column
                    description: body.description,
                    consentAccuracy: body.consentAccuracy,
                    consentRisk: body.consentRisk,
                    businessDetails: {
                        seasonTarget: body.seasonTarget,
                        durationDays: body.durationDays,
                        sellLocations: body.sellLocations,
                        supplierReady: body.supplierReady,
                        stallType: body.stallType,
                        collegePermission: body.collegePermission,
                        operatingDays: body.operatingDays,
                        expectedFootfall: body.expectedFootfall,
                        platforms: body.platforms,
                        productCategory: body.productCategory,
                        existingPageLink: body.existingPageLink,
                        foodType: body.foodType,
                        targetCustomers: body.targetCustomers,
                        operatingFrom: body.operatingFrom,
                        fssai: body.fssai,
                        mealsPerDay: body.mealsPerDay,
                        primarySkill: body.primarySkill,
                        clientAcquisition: body.clientAcquisition,
                        clientsPerMonth: body.clientsPerMonth,
                        pricingModel: body.pricingModel,
                        priorExperienceText: body.priorExperienceText,
                        agriBusinessType: body.agriBusinessType,
                        landAvailable: body.landAvailable,
                        agriSeasonTarget: body.agriSeasonTarget,
                        sellThrough: body.sellThrough,
                        expectedRevenue: body.expectedRevenue
                    },
                    supportDetails: {
                        supportNeeded: body.supportNeeded,
                        timeline: body.timeline,
                        profitSharing: body.profitSharing,
                        extraInfo: body.extraInfo
                    }
                }
            ])
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
            throw error;
        }

        console.log("Student Pitch Saved: ", data?.[0]?.id);

        return NextResponse.json({ success: true, message: 'Student pitch received successfully.' });
    } catch (error) {
        console.error("Error processing student join request:", error);
        return NextResponse.json({ error: 'Internal server error while saving pitch' }, { status: 500 });
    }
}
