import {getDocument, OPS} from 'pdfjs-dist'
import {PNG} from 'pngjs'

export async function extractImagesFromPdf(pdfPath: string | Buffer): Promise<Buffer[]> {
  const loadingTask = getDocument(pdfPath)
  const pdf = await loadingTask.promise

  const numPages = pdf.numPages
  const images: Buffer[] = []

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i)
    const ops = await page.getOperatorList()

    for (let j = 0; j < ops.fnArray.length; j++) {
      if (ops.fnArray[j] === OPS.paintImageXObject) {
        const args = ops.argsArray[j] as unknown[]
        const imgName = args[0] as string
        const imgObj = page.objs.get(imgName) as NodeJS.Dict<unknown>
        const {width, height, data: imgData} = imgObj
        if (!(imgData instanceof Uint8ClampedArray) || typeof width !== 'number' || typeof height !== 'number') continue
        const png = new PNG({width, height})
        png.data = Buffer.from(rgbToRgba(imgData))
        images.push(PNG.sync.write(png))
      }
    }
  }
  return images
}

function rgbToRgba(imgData: Uint8ClampedArray): Uint8ClampedArray {
  const rgbaData = new Uint8ClampedArray((imgData.length / 3) * 4)
  for (let i = 0; i < imgData.length; i += 3) {
    rgbaData[(i * 4) / 3] = imgData[i]
    rgbaData[(i * 4) / 3 + 1] = imgData[i + 1]
    rgbaData[(i * 4) / 3 + 2] = imgData[i + 2]
    rgbaData[(i * 4) / 3 + 3] = 255
  }
  return rgbaData
}
