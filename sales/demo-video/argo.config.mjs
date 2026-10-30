import { defineConfig } from '@argo-video/cli';
import { createEdgeTtsEngine } from './edge-tts-engine.mjs';

export default defineConfig({
  baseURL: process.env.EBLOCK_DEMO_BASE_URL ?? 'http://127.0.0.1:8013',
  demosDir: 'demos',
  outputDir: 'videos',
  tts: {
    engine: createEdgeTtsEngine({ voice: 'es-CO-GonzaloNeural' }),
    defaultVoice: 'es-CO-GonzaloNeural',
    defaultSpeed: 1.0,
  },
  video: {
    // 540x960 CSS at DPR 2 yields a native 1080x1920 Chromium screencast.
    width: 540,
    height: 960,
    fps: 30,
    browser: 'chromium',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    captureMode: 'jpeg-stitch',
    jpegQuality: 92,
    cursorHighlight: { color: '#d8471a', radius: 18, pulse: true, clickRipple: true, opacity: 0.9 },
  },
  export: {
    outputWidth: 1080,
    outputHeight: 1920,
    preset: 'slow',
    crf: 19,
    encoder: 'cpu',
    sharpen: { strength: 0.35 },
    audio: { loudnorm: true },
    frame: { padding: 0, borderRadius: 0, shadow: 0, background: { type: 'solid', value: '#160d09' } },
  },
  overlays: { autoBackground: true, defaultPlacement: 'top-left' },
});
