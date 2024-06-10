import { writeFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { constants } from './config';

export async function saveFileToTempFolder(file: File): Promise<string> {
  const tempFilePath = path.join(path.resolve(process.cwd(), constants.tempFoldeName), file.name);
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempFilePath, buffer);

    return tempFilePath;
  } catch (error) {
    throw new Error('Error saving file to temp folder');
  }
}

export async function clearTempFolder() {
  await removeAllFilesInFolder(path.join(path.resolve(process.cwd(), constants.tempFoldeName)));
}

export async function removeAllFilesInFolder(folderPath: string): Promise<void> {
  try {
    // Read all files in the directory
    const files = await readdir(folderPath);

    // Remove each file
    const removeFilePromises = files.map(async (file) => {
      const filePath = path.join(folderPath, file);
      await unlink(filePath);
    });

    // Wait for all file removal promises to complete
    await Promise.all(removeFilePromises);

    console.log(`All files in ${folderPath} have been removed.`);
  } catch (error) {
    console.error(`Error removing files in ${folderPath}:`, error);
  }
}

// Usage example:
// const folderPath = path.join(__dirname, '../../temp'); // Change this to your folder path
// console.log({ folderPath });
