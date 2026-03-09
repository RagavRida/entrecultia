import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.email || !body.phone || !body.budget || !body.goal || !body.idFileUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Save to Supabase Database
        const { data, error } = await supabase
            .from('BackerProfile')
            .insert([
                {
                    name: body.name,
                    age: body.age,
                    city: body.city,
                    email: body.email,
                    phone: body.phone,
                    idProofUrl: body.idFileUrl,
                    occupation: body.occupation,
                    source: body.source,
                    budget: body.budget,
                    seasons: JSON.stringify(body.seasons),
                    categories: JSON.stringify(body.categories),
                    goal: body.goal,
                    riskAcknowledged: body.riskAcknowledged,
                    consentAccuracy: body.consentAccuracy,
                    consentRisk: body.consentRisk,
                }
            ])
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
            throw error;
        }

        console.log("Backer Profile Saved: ", data?.[0]?.id);

        return NextResponse.json({ success: true, message: 'Backer profile received successfully.' });
    } catch (error) {
        console.error("Error processing backer join request:", error);
        return NextResponse.json({ error: 'Internal server error while saving profile' }, { status: 500 });
    }
}
