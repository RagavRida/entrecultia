import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase credentials from .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
    console.log("Testing upload to 'id-documents' bucket...");

    const fileContent = "This is a test file to verify storage policies.";
    const blob = new Blob([fileContent], { type: 'text/plain' });

    console.log("Uploading test file...");
    const { data, error } = await supabase.storage
        .from('id-documents')
        .upload(`test_${Date.now()}.txt`, blob);

    if (error) {
        console.error("❌ Upload failed. Supabase Error:", error);

        // Check if the bucket exists
        console.log("Checking if the bucket exists...");
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
            console.error("❌ Could not list buckets:", bucketError);
        } else {
            console.log("Available Buckets:", buckets.map(b => b.name));
            if (!buckets.find(b => b.name === 'id-documents')) {
                console.error("❌ The bucket 'id-documents' does NOT exist!");
            }
        }
    } else {
        console.log("✅ Upload succeeded:", data);
    }
}

testUpload();
