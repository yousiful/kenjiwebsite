import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shell, NeedsSignIn, useMe } from '../ui';
import { api, ApiError } from '../api';
import { PLANS, PLAN_IDS, TOPUP, isPlanId, type PlanId } from '../models';

const ACTIVE = ['active', 'trialing', 'past_due'];

function Billing() {
  const { me } = useMe();
  const user = me!.user!;
  const billingOn = !!me?.setup?.billing;
  const [params] = useSearchParams();
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const subscribed = isPlanId(user.plan) && ACTIVE.includes(user.subStatus);
  const paid = params.get('paid');

  const go = async (key: string, fn: () => Promise<{ url: string }>) => {
    setBusy(key); setError('');
    try {
      const r = await fn();
      window.location.href = r.url;
    } catch (e) {
      setError((e as ApiError).message);
      setBusy('');
    }
  };

  return (
    <main className="vg-wrap">
      <section className="vg-hero" style={{ paddingBottom: 24 }}>
        <h1 className="vg-h2">Your plan</h1>
        <p className="vg-lead">
          {subscribed ? <>You are on <b style={{ color: 'var(--paper)' }}>{PLANS[user.plan as PlanId].name}</b> with {user.balance.toLocaleString()} credits.</> : <>You have {user.balance.toLocaleString()} credits. Pick a plan to get a fresh batch every month.</>}
        </p>
        {paid && <p className="vg-note" role="status">Thanks. Your payment went through; credits show up within a minute.</p>}
        {user.subStatus === 'past_due' && <p className="vg-error" role="alert">Your last payment did not go through. Update your card under Manage billing to keep your credits coming.</p>}
        {!billingOn && <p className="vg-note" role="status">Billing is not connected yet. We are finishing setup, please check back soon.</p>}
        {error && <p className="vg-error" role="alert">{error}</p>}
      </section>

      <div className="vg-ledger" style={{ marginTop: 0 }}>
        {PLAN_IDS.map((id) => {
          const p = PLANS[id];
          const current = subscribed && user.plan === id;
          return (
            <div className="vg-ledger-row" key={id}>
              <span className="vg-ledger-name">{p.name}</span>
              <span className="vg-ledger-detail">
                <b>{p.credits.toLocaleString()} credits a month.</b> {p.line}.<br />
                <span className="vg-ledger-price">${p.usd}<small> a month</small></span>
              </span>
              <span className="vg-ledger-actions">
                {current ? (
                  <span className="vg-current">Your plan</span>
                ) : (
                  <button
                    type="button"
                    className={id === 'creator' && !subscribed ? 'vg-btn vg-btn--primary' : 'vg-btn vg-btn--quiet'}
                    disabled={!billingOn || !!busy}
                    onClick={() => go(id, () => api.checkout({ plan: id }))}
                  >
                    {busy === id ? 'Opening...' : subscribed ? `Switch to ${p.name}` : `Choose ${p.name}`}
                  </button>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <section className="vg-section" style={{ borderTop: 0, paddingTop: 40 }}>
        <h2 className="vg-title">Extra credits</h2>
        <p className="vg-lead" style={{ marginTop: 8 }}>
          {TOPUP.credits} credits for ${TOPUP.usd}, one time. {subscribed ? 'They roll over with the rest of your credits.' : 'Available once you are on a plan.'}
        </p>
        <div className="vg-row">
          <button type="button" className="vg-btn vg-btn--quiet" disabled={!billingOn || !subscribed || !!busy} onClick={() => go('topup', () => api.checkout({ topup: true }))}>
            {busy === 'topup' ? 'Opening...' : `Add ${TOPUP.credits} credits`}
          </button>
          {subscribed && (
            <button type="button" className="vg-btn vg-btn--text" disabled={!billingOn || !!busy} onClick={() => go('portal', api.portal)}>
              {busy === 'portal' ? 'Opening...' : 'Manage billing, change card or cancel'}
            </button>
          )}
        </div>
        <p className="vg-note">Unused credits roll over while your plan is active and end when the plan ends. Payments are handled by Stripe.</p>
      </section>
    </main>
  );
}

export default function VidgenBilling() {
  return (
    <Shell title="Your plan | Kenji Studio">
      <NeedsSignIn><Billing /></NeedsSignIn>
    </Shell>
  );
}
