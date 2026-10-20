/**
 * Seedance 2.5 text-to-video example using the official Higgsfield SDK.
 * Makes one billable generation.
 *
 *   npx tsx --env-file=.env.local scripts/higgsfield/index.ts
 *
 * HF_CREDENTIALS (key-id:key-secret) lives in .env.local, which is git-ignored.
 */
import { config, higgsfield } from '@higgsfield/client/v2';
import { HiggsfieldError, NotEnoughCreditsError } from '@higgsfield/client';

const MODEL = 'bytedance/seedance-2.5/text-to-video';

if (!process.env.HF_CREDENTIALS) {
  console.error('HF_CREDENTIALS is not set. Add it to .env.local as key-id:key-secret.');
  process.exit(1);
}
config({ credentials: process.env.HF_CREDENTIALS });

try {
  const result = await higgsfield.subscribe(MODEL, {
    input: {
      prompt: 'A cinematic scene at sunset',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9',
    },
    withPolling: true,
  });

  // The SDK types list queued/in_progress/completed/failed/nsfw; the API can also report canceled.
  const status = result.status as string;
  if (status === 'completed' && result.video?.url) {
    console.log(`Completed (request ${result.request_id})`);
    console.log(result.video.url);
  } else if (status === 'nsfw') {
    console.error(`Moderated: the request was flagged and no video was returned (request ${result.request_id}).`);
    process.exit(1);
  } else if (status === 'failed' || status === 'canceled') {
    console.error(`Generation ${status} (request ${result.request_id}).`);
    process.exit(1);
  } else {
    console.error(`No video URL returned. Status: ${status} (request ${result.request_id}).`);
    process.exit(1);
  }
} catch (err) {
  if (err instanceof NotEnoughCreditsError) {
    console.error('Not enough Higgsfield API credits. Top up at console.higgsfield.ai.');
  } else if (err instanceof HiggsfieldError) {
    console.error(`Higgsfield error: ${err.message}`);
  } else {
    console.error(err);
  }
  process.exit(1);
}
