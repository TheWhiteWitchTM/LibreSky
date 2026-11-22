import assert from 'node:assert/strict';
import test from 'node:test';
import { gifDescription, gifPlayer, gifRecordUrl, isAnimatedGif } from './gif.js';

test('a picker GIF keeps the height, width, and Klipy video names Bluesky expects', () => {
  const tenor = gifRecordUrl({
    title: 'Cat',
    media_formats: { gif: { url: 'https://media.tenor.com/AAAAC123/cat.gif', dims: [320, 240] } },
  });
  assert.equal(tenor, 'https://media.tenor.com/AAAAC123/cat.gif?hh=240&ww=320');
  const klipy = gifRecordUrl({
    content_description: 'Wave',
    media_formats: {
      gif: { url: 'https://static.klipy.com/ii/abc/wave.gif', dims: [300, 200] },
      mp4: { url: 'https://static.klipy.com/ii/abc/clip-mp4.mp4' },
      webm: { url: 'https://static.klipy.com/ii/abc/clip-webm.webm' },
    },
  });
  assert.equal(klipy, 'https://static.klipy.com/ii/abc/wave.gif?hh=200&ww=300&mp4=clip-mp4&webm=clip-webm');
  assert.equal(gifDescription('Wave'), 'ALT: Wave');
  assert.equal(gifDescription('Wave', ' a hand '), 'Alt: a hand');
});

test('Tenor and Klipy embeds play from the Bluesky video addresses', () => {
  const tenor = gifPlayer('https://media.tenor.com/AAAAC123/cat.gif?hh=240&ww=320');
  assert.deepEqual(tenor.sources, [
    { src: 'https://t.gifs.bsky.app/AAAP3123/cat.webm', type: 'video/webm' },
    { src: 'https://t.gifs.bsky.app/AAAP1123/cat.mp4', type: 'video/mp4' },
  ]);
  assert.equal(tenor.width, 320);
  assert.equal(tenor.height, 240);
  const klipy = gifPlayer('https://static.klipy.com/ii/abc/wave.gif?hh=200&ww=300&mp4=clip-mp4&webm=clip-webm');
  assert.equal(klipy.sources[0].src, 'https://k.gifs.bsky.app/ii/abc/clip-webm.webm');
  assert.equal(klipy.sources[1].src, 'https://k.gifs.bsky.app/ii/abc/clip-mp4.mp4');
  assert.equal(gifPlayer('https://static.klipy.com/ii/abc/wave.gif?hh=200&ww=300'), null);
  assert.equal(gifPlayer('https://giphy.com/gifs/cat'), null);
});

function gifBytes(frames) {
  const bytes = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 1, 0, 1, 0, 0x00, 0, 0];
  for (let n = 0; n < frames; n += 1) {
    bytes.push(0x2c, 0, 0, 0, 0, 1, 0, 1, 0, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00);
  }
  bytes.push(0x3b);
  return Uint8Array.from(bytes).buffer;
}

test('a GIF with more than one frame is animated and a still is not', () => {
  assert.equal(isAnimatedGif(gifBytes(1)).isAnimated, false);
  assert.equal(isAnimatedGif(gifBytes(2)).frames, 2);
  assert.equal(isAnimatedGif(gifBytes(2)).isAnimated, true);
  assert.equal(isAnimatedGif(new ArrayBuffer(0)).isGif, false);
});
