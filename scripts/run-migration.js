import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    try {
        console.log('Reading migration file...');
        const migrationSql = readFileSync('./supabase/migrations/20250909170809_add_message_timestamp.sql', 'utf8');
        
        console.log('Executing migration...');
        console.log('SQL:', migrationSql.substring(0, 200) + '...');
        
        const { data, error } = await supabase.rpc('exec_sql', {
            sql: migrationSql
        });
        
        if (error) {
            console.error('Migration failed:', error);
            process.exit(1);
        }
        
        console.log('Migration completed successfully!');
        console.log('Data:', data);
        
    } catch (error) {
        console.error('Error running migration:', error);
        process.exit(1);
    }
}

runMigration();