const IMAGE_BASE_URL = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image'
const IMAGE_SIZE = 'landscape_4_3'

export function buildImageUrl(prompt: string): string {
  return `${IMAGE_BASE_URL}?image_size=${IMAGE_SIZE}&prompt=${encodeURIComponent(prompt)}`
}

export interface WithImagePrompt {
  imagePrompt: string
}

export function resolveCafeImages<T extends WithImagePrompt>(items: T[]): (Omit<T, 'imagePrompt'> & { image: string })[] {
  return items.map((item) => {
    const { imagePrompt, ...rest } = item
    return { ...rest, image: buildImageUrl(imagePrompt) }
  })
}
