import { copyFile, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { getPhoto, photos } from '../src/data/archive.ts'

const root = process.cwd()
const mediaDir = path.join(root, 'public', 'media')

await rm(mediaDir, { recursive: true, force: true })
await mkdir(mediaDir, { recursive: true })

for (const photo of photos) {
  const input = path.join(root, 'res', photo.classId, photo.source)
  const base = sharp(input).rotate()

  await base
    .clone()
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 76, effort: 5 })
    .toFile(path.join(mediaDir, `${photo.id}-card.webp`))

  await base
    .clone()
    .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(mediaDir, `${photo.id}-large.webp`))
}

const rootAssets = await readdir(path.join(root, 'res'))
const logoName = rootAssets.find((name) => name.startsWith('ic_') && name.endsWith('.png'))
if (!logoName) throw new Error('단성고 아이콘을 찾을 수 없습니다.')

const logoInput = path.join(root, 'res', logoName)
await copyFile(logoInput, path.join(root, 'public', 'dansung-logo.png'))
await sharp(logoInput)
  .extract({ left: 0, top: 0, width: 46, height: 46 })
  .resize(128, 128)
  .png()
  .toFile(path.join(root, 'public', 'favicon.png'))

const ogIds = ['11-group', '21-classroom-1', '22-classroom-1', '31-classroom-4']
const ogPanels = await Promise.all(ogIds.map(async (id) => {
  const photo = getPhoto(id)
  if (!photo) throw new Error(`OG 사진을 찾을 수 없습니다: ${id}`)
  return sharp(path.join(root, 'res', photo.classId, photo.source))
    .rotate()
    .resize(300, 630, { fit: 'cover' })
    .modulate({ saturation: 0.88, brightness: 0.87 })
    .toBuffer()
}))

const logo = await sharp(logoInput).resize({ width: 340 }).png().toBuffer()
const logoPlate = await sharp({
  create: { width: 460, height: 132, channels: 4, background: { r: 255, g: 250, b: 240, alpha: 0.95 } },
}).png().toBuffer()
const orangeBar = await sharp({
  create: { width: 1200, height: 18, channels: 4, background: '#e56f2d' },
}).png().toBuffer()

await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#171513' } })
  .composite([
    { input: ogPanels[0], left: 0, top: 0 },
    { input: ogPanels[1], left: 300, top: 0 },
    { input: ogPanels[2], left: 600, top: 0 },
    { input: ogPanels[3], left: 900, top: 0 },
    { input: logoPlate, left: 54, top: 54 },
    { input: logo, left: 114, top: 74 },
    { input: orangeBar, left: 0, top: 612 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'public', 'og.png'))

console.log(`사진 ${photos.length}장의 카드용·확대용 이미지를 생성했습니다.`)
