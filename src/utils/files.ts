import * as XLSX from 'xlsx';
import { IGradeRecord } from './types';


/**
 * Read excel file and parse it into a list of json objects
 * @param file source file
 * @returns a promise that resolves to a list of json objects
 */
export function readExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData: IGradeRecord[] = XLSX.utils.sheet_to_json(worksheet);
      resolve(jsonData);
    };

    reader.readAsArrayBuffer(file);
  })
}

/**
 * Generate excel file from a list of json data
 * @param data data to be written to excel
 * @param filename generated excel filename
 */
export function generateExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, filename);
}
