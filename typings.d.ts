declare module "*.mp4";

declare module 'colorthief' {
  export default class ColorThief {
    getColor(sourceImage: HTMLImageElement, quality?: number): number[];
    getPalette(sourceImage: HTMLImageElement, colorCount?: number, quality?: number): number[][];
  }
}

declare module '*.module.css' {
  const styles: {
    readonly [key: string]: string
  }
  export default styles
}