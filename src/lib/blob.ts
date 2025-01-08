// lib/blob.ts
import { put, del, list } from '@vercel/blob'

export async function uploadImageToBlob(file: File) {
  const blob = await put(`announcements/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })
  return blob
}

export async function deleteImageFromBlob(url: string) {
  await del(url)
}

export async function listImagesInBlob() {
  const { blobs } = await list({ 
    prefix: 'announcements',
    limit: 100 
  })
  return blobs
}