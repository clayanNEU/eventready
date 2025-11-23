import fs from 'fs';
import path from 'path';
import { AppData } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data', 'app-data.json');

const defaultData: AppData = {
  brand: {
    colors: ['#FF6B35', '#004E89'],
    style: 'bold, energetic, community-focused',
    seed: 12345,
  },
  flyers: [],
};

// In-memory storage for serverless environments
let memoryStore: AppData | null = null;

export function ensureDataFile() {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
    }
  } catch (error) {
    // On Vercel/serverless, file writes might fail
    // This is OK - we'll use default data
    console.warn('Could not create data file:', error);
  }
}

export function readData(): AppData {
  // First, try to read from memory store
  if (memoryStore) {
    return memoryStore;
  }

  // Then try to read from file
  try {
    ensureDataFile();
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      const parsedData = JSON.parse(data);
      memoryStore = parsedData; // Cache in memory
      return parsedData;
    }
  } catch (error) {
    console.warn('Could not read data file:', error);
  }

  // Initialize memory store with default data
  memoryStore = { ...defaultData };
  return memoryStore;
}

export function writeData(data: AppData) {
  // Always update memory store first
  memoryStore = data;

  // Try to persist to file (may fail on serverless)
  try {
    ensureDataFile();
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.warn('Could not write data file (using memory storage):', error);
    // Don't throw - memory storage is sufficient for serverless
  }
}
