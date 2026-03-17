'use client';

import { useEffect } from 'react';
import { captureUtms } from '@/app/lib/utm';

export default function UtmCapture() {
  useEffect(() => {
    captureUtms();
  }, []);

  return null;
}
