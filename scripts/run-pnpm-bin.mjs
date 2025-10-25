#!/usr/bin/env node
import { readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const pnpmDir = path.join(projectRoot, 'node_modules/.pnpm')

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: run-pnpm-bin <package> <bin-relative-path> [args...]')
  process.exit(1)
}

const [packageName, binRelative, ...commandArgs] = args

function findPackageDir(name) {
  const entries = readdirSync(pnpmDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${name}@`))
    .sort((a, b) => b.name.localeCompare(a.name))
  if (!entries.length) {
    console.error(`Unable to locate package "${name}" inside node_modules/.pnpm`)
    process.exit(1)
  }
  return path.join(pnpmDir, entries[0].name, 'node_modules', name)
}

const packageDir = findPackageDir(packageName)
const binPath = path.join(packageDir, binRelative)
if (!existsSync(binPath)) {
  console.error(`Unable to locate executable for ${packageName}: ${binPath}`)
  process.exit(1)
}

const extraNodePaths = [path.join(projectRoot, 'stubs')]
for (const entry of readdirSync(pnpmDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  extraNodePaths.push(path.join(pnpmDir, entry.name, 'node_modules'))
}

extraNodePaths.push(
  path.join(packageDir, 'bin', 'node_modules'),
  path.join(packageDir, 'node_modules'),
  path.join(path.dirname(packageDir), 'node_modules'),
  path.join(pnpmDir, 'node_modules'),
)

const delimiter = path.delimiter
const env = { ...process.env }
const existing = env.NODE_PATH ? env.NODE_PATH.split(delimiter) : []
const nodePath = [...extraNodePaths, ...existing].filter(Boolean)
env.NODE_PATH = nodePath.join(delimiter)

const child = spawn(process.execPath, [binPath, ...commandArgs], {
  stdio: 'inherit',
  env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
  } else {
    process.exit(code ?? 0)
  }
})
