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
  try {
    ensureDataFile();
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Could not read data file:', error);
  }
  // Return default data if file doesn't exist or can't be read
  return defaultData;
}

export function writeData(data: AppData) {
  try {
    ensureDataFile();
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Could not write data file:', error);
    throw new Error('Unable to save data. This may be a read-only environment.');
  }
}
