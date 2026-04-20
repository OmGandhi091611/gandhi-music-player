import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

function audioWatcherPlugin() {
  return {
    name: 'audio-watcher',
    configureServer(server) {
      const audioDir = resolve(__dirname, 'public/audio')
      server.watcher.add(audioDir)
      server.watcher.on('add', (file) => {
        if (/^(?!\._).+\.(mp3|m4a|aac|ogg|flac|wav)$/i.test(file.split('/').pop())) {
          execSync('node scripts/generate-playlist.js', { stdio: 'inherit' })
          server.restart()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), audioWatcherPlugin()],
})
