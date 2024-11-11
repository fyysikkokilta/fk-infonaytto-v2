export type PageProps = {
  showNext: (timeout: number) => Timer
}

export type PageType = {
  name: string
  priority: number
  isActive: () => boolean
  component: ({ showNext }: PageProps) => React.JSX.Element
}
