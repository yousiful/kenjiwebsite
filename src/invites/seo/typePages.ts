// Which landing page (/invites/<slug>) belongs to each kind of celebration. Tiny on
// purpose: the guest invitation page imports it for its "make your own" link.
import type { EventType } from '../shared';

export const TYPE_PAGE: Record<EventType, string> = {
  wedding: 'wedding-invitations',
  birthday: 'birthday-invitations',
  graduation: 'graduation-invitations',
  baby: 'baby-shower-invitations',
  bridal: 'bridal-shower-invitations',
  engagement: 'engagement-party-invitations',
  anniversary: 'anniversary-invitations',
  quince: 'quinceanera-invitations',
  mitzvah: 'bar-mitzvah-invitations',
  retirement: 'retirement-party-invitations',
  housewarming: 'housewarming-invitations',
  holiday: 'holiday-party-invitations',
  business: 'business-event-invitations',
  reunion: 'family-reunion-invitations',
  custom: 'templates',
};

/** Link from a guest's invitation to making their own (?from=guest marks the visit in logs). */
export const makeYourOwnHref = (type: EventType) => `/invites/${TYPE_PAGE[type]}?from=guest`;
