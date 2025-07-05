# ponopono-api

A simple and lightweight client library for interacting with the FP PonoPono File API.

## Installation

```bash
npm install ponopono-api
```

## Usage

First, you need to import the library and initialize the client with your API key and secret.

```typescript
import { PonopnoApi } from 'ponopono-api';
import { writeFileSync } from 'fs';

const apiKey = 'YOUR_API_KEY';
const apiSecret = 'YOUR_API_SECRET';

const ponopono = new PonopnoApi(apiKey, apiSecret);
```

### Search for files

You can search for files using various criteria.

```typescript
async function findFiles() {
  try {
    const searchResult = await ponopono.searchFiles({
      area: '01', // Example area
      filename: 'example.csv', // Example filename
      downloaded: false
    });
    console.log('Found files:', searchResult.data);
    return searchResult.data;
  } catch (error) {
    console.error('Error searching files:', error);
  }
}
```

### Download a file

Once you have a file's `downloadPath`, you can download it.

```typescript
async function downloadFile(downloadPath: string) {
  try {
    const fileResponse = await ponopono.getFile(downloadPath);
    // Save the file to disk
    writeFileSync(fileResponse.filename, Buffer.from(fileResponse.file));
    console.log(`File downloaded and saved as ${fileResponse.filename}`);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

// Example workflow
async function main() {
    const files = await findFiles();
    if (files && files.length > 0) {
        // Download the first file found
        await downloadFile(files[0].downloadPath);
    }
}

main();
```

## API Reference

### `new PonopnoApi(key, secret)`

Creates a new API client instance.

-   `key` (string): Your API key.
-   `secret` (string): Your API secret.

### `searchFiles(searchParams?)`

Searches for files based on the provided parameters.

-   `searchParams` (PonoponoSearthParmas): An optional object with search criteria.
    -   `area` (TSOArea, optional): Area code (e.g., "01", "02").
    -   `filename` (string, optional): Filter by filename. This performs a partial match search.
    -   `from` (string, optional): Start date (YYYY-MM-DD).
    -   `to` (string, optional): End date (YYYY-MM-DD).
    -   `downloaded` (boolean, optional): Filter by download status.
-   Returns: `Promise<PonoponoSearchFileResponse>`

### `getFile(downloadPath)`

Downloads a file from the specified path.

-   `downloadPath` (string): The `downloadPath` obtained from the `searchFiles` response.
-   Returns: `Promise<FileResonse>` which contains:
    -   `filename` (string): The name of the downloaded file.
    -   `file` (ArrayBuffer): The file content as an ArrayBuffer.

## License

This project is licensed under the MIT License.
