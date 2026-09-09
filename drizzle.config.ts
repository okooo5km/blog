import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './db/schema.ts',
  out: './db/d1-generated',
})
