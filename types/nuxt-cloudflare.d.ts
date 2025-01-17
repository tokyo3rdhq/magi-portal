declare module 'nitropack' {
  interface CloudflareOptions {
    compatibilityDate?: string
    pages?: {
      routes?: {
        include?: string[]
        exclude?: string[]
      }
    }
  }
}
