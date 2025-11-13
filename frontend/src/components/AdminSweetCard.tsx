import React from 'react';
import { formatINR } from '../utils/currency';
import { getLocalImagePath, getRemoteImage, getPlaceholder } from '../assets/imageMap';

type Sweet = {
  id: string;
  name: string;
  category: string;
  price: string | number;
  quantity: number;
};

export default function AdminSweetCard({
  sweet,
  onRestock,
  onEdit,
  onDelete
}: {
  sweet: Sweet;
  onRestock: (id: string) => void;
  onEdit: (s: Sweet) => void;
  onDelete: (id: string) => void;
}) {
  const [src, setSrc] = React.useState<string>(getLocalImagePath(sweet.name));
  const [attempt, setAttempt] = React.useState(0); // 0=local,1=remote,2=placeholder

  const handleError = () => {
    if (attempt === 0) { setSrc(getRemoteImage(sweet.name)); setAttempt(1); }
    else if (attempt === 1) { setSrc(getPlaceholder(sweet.name)); setAttempt(2); }
  };

  return (
    <div className="card">
      <img className="thumb" src={src} alt={sweet.name} loading="lazy" onError={handleError} />
      <div className="title">{sweet.name}</div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="badge">{sweet.category}</span>
        <strong>{formatINR(sweet.price)}</strong>
      </div>
      <div className="row" style={{ marginBottom: 8, gap: 8 }}>
        <button className="primary" onClick={() => onRestock(sweet.id)}>Restock</button>
        <button onClick={() => onEdit(sweet)}>Edit</button>
        <button className="danger" onClick={() => onDelete(sweet.id)}>Delete</button>
      </div>
      <div style={{ color: '#a7f3d0' }}>Stock: {sweet.quantity}</div>
    </div>
  );
}