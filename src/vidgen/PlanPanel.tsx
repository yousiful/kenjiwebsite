import { useState } from 'react';
import { api, ApiError } from './api';
import { PLANS, PLAN_IDS, type PlanId } from './models';
import { useMe } from './ui';

/** Inline plan picker (no popup). Each plan opens Stripe Checkout. */
export default function PlanPanel({ title, lead }: { title: string; lead: string }) {
  const { me } = useMe();
  const [busy, setBusy] = useState<PlanId | ''>('');
  const [error, setError] = useState('');
  const billingOn = !!me?.setup.billing;

  const pick = async (id: PlanId) => {
    setBusy(id); setError('');
    try {
      window.location.href = (await api.checkout({ plan: id })).url;
    } catch (e) {
      setError((e as ApiError).message);
      setBusy('');
    }
  };

  return (
    <section className="vg-plans" aria-labelledby="vg-plans-title">
      <h2 id="vg-plans-title" className="vg-title">{title}</h2>
      <p className="vg-lead" style={{ marginTop: 8 }}>{lead}</p>
      <div className="vg-ledger" style={{ marginTop: 20 }}>
        {PLAN_IDS.map((id) => {
          const p = PLANS[id];
          return (
            <div className="vg-ledger-row" key={id}>
              <span className="vg-ledger-name">{p.name}</span>
              <span className="vg-ledger-detail">
                <b>{p.credits.toLocaleString()} credits a month.</b> {p.line}.<br />
                <span className="vg-ledger-price">${p.usd}<small> a month</small></span>
              </span>
              <span className="vg-ledger-actions">
                <button
                  type="button"
                  className={id === 'creator' ? 'vg-btn vg-btn--primary' : 'vg-btn vg-btn--quiet'}
                  disabled={!billingOn || !!busy}
                  onClick={() => pick(id)}
                >
                  {busy === id ? 'Opening...' : `Choose ${p.name}`}
                </button>
              </span>
            </div>
          );
        })}
      </div>
      {!billingOn && <p className="vg-note" role="status">Billing is not connected yet. We are finishing setup, please check back soon.</p>}
      {error && <p className="vg-error" role="alert">{error}</p>}
      <p className="vg-note">Cancel any time. Unused credits roll over while your plan is active.</p>
    </section>
  );
}
