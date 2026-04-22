/**
 * Meta (Facebook) Tracking Configuration
 * 
 * IMPORTANT: For production, these should be set via environment variables.
 * VITE_META_PIXEL_ID
 * VITE_META_ACCESS_TOKEN
 */

export const META_CONFIG = {
  pixelId: import.meta.env.VITE_META_PIXEL_ID || '2406747486323295',
  accessToken: import.meta.env.VITE_META_ACCESS_TOKEN || 'EAAG9A5px4gMBOZC9Dzoca4bGAvSOSVI0gVZCxTjYPJfsPhQApTcPldJaLxE3q2dzgXw0fzs7UmZBFWj5HD4YfKfO5QnX6BVfxS6wRZCcZBcGMN4BsXzqXQTwYe53519apNj0OWi1IIa6eY5zqKamSymenEROmFMTvQ0JDXrPidOJpSs8tZBRn5ZCZADfZChrtUlc6sAZDZD',
  testEventCode: import.meta.env.VITE_META_TEST_EVENT_CODE || '',
  version: 'v17.0'
};

export const isTrackingEnabled = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('kenji_tracking_consent') === 'granted';
};
