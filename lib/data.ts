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
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
  }
}

export function readData(): AppData {
  ensureDataFile();
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

export function writeData(data: AppData) {
  ensureDataFile();
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}
