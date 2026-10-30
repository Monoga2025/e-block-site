import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/** Argo-compatible TTS engine using local Python edge-tts and Edge neural voices. */
export function createEdgeTtsEngine({ voice = 'es-CO-GonzaloNeural' } = {}) {
  return {
    describe() {
      return { engine: 'edge-tts-python', model: voice, instructions: 'Spanish (Colombia) neural narration' };
    },
    async generate(text, options = {}) {
      const directory = await mkdtemp(path.join(os.tmpdir(), 'eblock-edge-tts-'));
      const mediaPath = path.join(directory, 'speech.mp3');
      try {
        await execFileAsync('py', ['-m', 'edge_tts', '--voice', options.voice || voice, '--rate', '+0%', '--text', text, '--write-media', mediaPath], { windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
        const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
        const { stdout } = await execFileAsync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', mediaPath, '-f', 'wav', '-acodec', 'pcm_f32le', '-ac', '1', '-ar', '24000', 'pipe:1'], { windowsHide: true, encoding: 'buffer', maxBuffer: 32 * 1024 * 1024 });
        return stdout;
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
    },
  };
}
