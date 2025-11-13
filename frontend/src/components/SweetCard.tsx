import React from 'react';
import { formatINR } from '../utils/currency';
import { getLocalImagePath, getRemoteImage, getPlaceholder } from '../assets/imageMap';

type Sweet = { id: string; name: string; category: string; price: string | number; quantity: number; };

export default function SweetCard({ sweet, onPurchase, isAuthed }: {
  sweet: Sweet; onPurchase: (id: string) => void; isAuthed: boolean;
}) {
  const [src, setSrc] = React.useState<string>(getLocalImagePath(sweet.name));
  const [attempt, setAttempt] = React.useState(0); // 0 local -> 1 remote -> 2 placeholder
  const onError = () => {
    if (attempt === 0) { setSrc(getRemoteImage(sweet.name)); setAttempt(1); }
    else if (attempt === 1) { setSrc(getPlaceholder(sweet.name)); setAttempt(2); }
  };
  const disabled = !isAuthed || sweet.quantity === 0;

  return (
    <div className="card">
      <img className="thumb" src={src} alt={sweet.name} onError={onError} loading="lazy" />
      <div className="title">{sweet.name}</div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="badge">{sweet.category}</span>
        <strong>{formatINR(sweet.price)}</strong>
      </div>
      <div className="row">
        <span style={{ color: sweet.quantity === 0 ? '#fca5a5' : '#a7f3d0' }}>
          {sweet.quantity === 0 ? 'Out of stock' : `In stock: ${sweet.quantity}`}
        </span>
        <button className="primary" disabled={disabled} onClick={() => onPurchase(sweet.id)}>
          {sweet.quantity === 0 ? 'Sold Out' : 'Purchase'}
        </button>
      </div>
    </div>
  );
}