import { cp, mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const root = process.cwd()
const docsDir = join(root, 'docs')
const outputDir = join(docsDir, '.vitepress', 'dist')
const staticEntries = ['demo.html', 'screenshots']

await mkdir(outputDir, { recursive: true })

for (const entry of staticEntries) {
  const source = join(docsDir, entry)
  const target = join(outputDir, entry)
  const sourceStat = await stat(source)

  await cp(source, target, {
    recursive: sourceStat.isDirectory(),
  })
}
