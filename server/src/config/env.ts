import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root (server folder)
// This file should be imported first before any other modules that use env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });
