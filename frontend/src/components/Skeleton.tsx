import React from 'react';

export default function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="skel" style={{ height: 180, marginBottom: 12 }} />
          <div className="skel" style={{ height: 18, width: '70%', margin: '8px 0' }} />
          <div className="skel" style={{ height: 14, width: '45%', marginBottom: 10 }} />
          <div className="skel" style={{ height: 38, width: '100%' }} />
        </div>
      ))}
    </div>
  );
}