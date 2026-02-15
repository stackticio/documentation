import React, { useRef, useEffect, useState } from 'react';

export default function ComponentDoc({ src, title }) {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resize = () => {
      try {
        const body = iframe.contentDocument?.body;
        const html = iframe.contentDocument?.documentElement;
        if (body && html) {
          const h = Math.max(body.scrollHeight, html.scrollHeight);
          setHeight(h + 40);
        }
      } catch (e) {
        // cross-origin fallback
      }
    };

    iframe.addEventListener('load', resize);
    return () => iframe.removeEventListener('load', resize);
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title || 'Component Documentation'}
      style={{
        width: '100%',
        height: `${height}px`,
        border: 'none',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}
