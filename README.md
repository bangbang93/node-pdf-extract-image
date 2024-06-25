# PDF Extract Image

This is a Node.js library for extracting images from PDF files. It uses `pdfjs-dist` for reading PDF files and `pngjs` for encoding the extracted images as PNG files.

This is library did not render the PDF file to image, it only extracts the images from the PDF file. So the pdf file must contain images. Otherwise, it will return an empty array.

## Installation

You can install this library using npm:

```bash
npm install pdf-extract-image
```

## Usage

Here's a basic example of how to use this library:

```typescript
import { extractImagesFromPdf } from 'pdf-extract-image';
import { writeFileSync } from 'fs';

async function main() {
  // const images = await extractImagesFromPdf(pdfBuffer);
  const images = await extractImagesFromPdf('/path/to/your.pdf');
  images.forEach((image, index) => {
    writeFileSync(`image${index}.png`, image);
  });
}

main().catch(console.error);
```

In this example, `extractImagesFromPdf` is used to extract images from a PDF file. The resulting images are then written to disk as PNG files.

## License

This project is licensed under the MIT License.
