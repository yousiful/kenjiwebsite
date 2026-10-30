// Guide pages for Kenji Invites (/invites/rsvp-website, /invites/evite-alternative).
// Competitor facts here must come from their own pricing or help pages; keep the
// "checked" date in the table note current when you re-check them.

export interface GuideSection {
  h: string;
  p: string[];
  list?: string[];
  table?: { head: string[]; rows: string[][]; note?: string };
}
export interface Guide {
  slug: string;
  title: string;
  description: string;
  h1: string;
  crumb: string;
  lead: string;
  sections: GuideSection[];
  faq: [string, string][];
  related: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'rsvp-website',
    title: 'Free RSVP Website and RSVP Tracker for Any Event | Kenji Invites',
    description: 'Make a free RSVP page for a wedding, party or event. Each guest gets their own link, replies are capped at the seats you give them, and every answer lands on one guest list you can download. No ads, no guest sign-up.',
    h1: 'A free RSVP website for any event',
    crumb: 'RSVP website',
    lead: 'Make the invitation, add your guests, and send each one their own RSVP link by text or email. They tap Yes or No and say how many are coming. You see every answer on one list.',
    sections: [
      {
        h: 'What an RSVP website does',
        p: [
          'An RSVP website is a page where guests answer your invitation: whether they are coming, how many people, and anything you need to know. Instead of chasing replies by text, the answers come to one place and add themselves up.',
          'On Kenji Invites the RSVP is part of the invitation itself. Guests open their link, see your card with the date, place and a countdown, and reply right under it.',
        ],
      },
      {
        h: 'Personal links or one shared link',
        p: [
          'There are two ways to collect RSVPs, and you can use both on the same invitation.',
        ],
        list: [
          'Personal links: every guest on your list gets their own link. It already knows their name and how many seats they have, so they just tap Yes or No. You can see who opened it and who has not answered yet.',
          'A shared link: one link for everyone, good for a group chat, a class page, a work channel or a QR code on a flyer. People type their name when they reply and are added to your guest list.',
        ],
      },
      {
        h: 'Seat limits that guests can\'t go over',
        p: [
          'The most common RSVP problem is a reply that says 5 when you invited 2. When you add a guest you choose how many seats they get. Their reply can be any number up to that, and they type the names of the people coming with them. For a shared link you set one limit for everyone.',
        ],
      },
      {
        h: 'Other ways people collect RSVPs',
        p: ['Here is how the usual options compare for a host who just wants to know who is coming.'],
        table: {
          head: ['Option', 'Good at', 'Where it falls short'],
          rows: [
            ['Group text', 'Fast, everyone already has it', 'Answers get lost in the thread, no head count, no limit on plus ones'],
            ['Google Forms', 'Free, flexible questions', 'No invitation design, no per-guest seat limits, you build it yourself'],
            ['Wedding website builders', 'Lots of pages for a wedding', 'Built for weddings only, guests often look themselves up on a public page'],
            ['Kenji Invites', 'A designed invitation with the RSVP on it, seat limits, a guest list that adds up', 'Made for one event at a time, not ticketed events or paid admission'],
          ],
        },
      },
      {
        h: 'What you see as the host',
        p: ['Your guest list shows each person, whether they opened the invitation, their answer, how many are coming, their names and any note. The totals at the top add up the yes answers. If someone tells you their answer in person, you can record it yourself. You can download the whole list as a spreadsheet for the caterer or the seating chart.'],
      },
    ],
    faq: [
      ['Is the RSVP website really free?', 'Yes. Making the invitation, sending it and collecting RSVPs are free, with no ads on the page guests see.'],
      ['Do guests need to make an account?', 'No. They open the link and answer. There is nothing to download.'],
      ['Can guests change their RSVP?', 'Yes. They use the same link any time before the event, and your list updates.'],
      ['Can I collect meal choices or allergies?', 'Guests can leave a note with their reply, and you see every note on your guest list. There are no custom form questions yet.'],
      ['Can I have RSVPs for more than one event, like a rehearsal dinner?', 'You can add every event of the weekend with its own time and place. The RSVP is for the invitation as a whole.'],
      ['Is my guest list public?', 'No. Only you and co-hosts you add can see it. Guests only see their own answer.'],
    ],
    related: ['wedding-invitations', 'birthday-invitations', 'evite-alternative', 'templates'],
  },
  {
    slug: 'evite-alternative',
    title: 'A Free Evite Alternative with No Ads | Kenji Invites',
    description: 'Looking for an Evite alternative that is free with no ads? Kenji Invites has 36 designs, up to 8 photos, RSVP with seat limits, and guests never need an account. Here is how it compares.',
    h1: 'A free Evite alternative, with no ads',
    crumb: 'Evite alternative',
    lead: 'Kenji Invites is a free online invitation with RSVP for any celebration. No ads on what your guests see, no paid design tiers, and guests reply without an account.',
    sections: [
      {
        h: 'Why people look for an Evite alternative',
        p: [
          'Evite is the name most people know, and it works. The usual complaints are about what comes with the free version: ads and gift suggestions on the invitation your guests open, and the nicer designs and an ad-free page sitting behind a per-event price. Other popular tools trade one problem for another, like asking every guest for a phone number before they can reply, or stopping the free plan after a set number of guests.',
          'Kenji Invites was built for the host who just wants a good-looking invitation, a quick yes or no from every guest, and no catch.',
        ],
      },
      {
        h: 'How the popular invitation sites compare',
        p: ['What each one asks of you and your guests on its free option, from their own pricing and help pages and recent published reviews.'],
        table: {
          head: ['Site', 'Free option', 'What to know'],
          rows: [
            ['Evite', 'Yes', 'Free invitations carry ads and gift suggestions. Premium, with no ads, is priced per event by guest count, starting around $17.99.'],
            ['Paperless Post', 'Partly', 'Free designs are free for the first 50 sends, then cost coins per guest. Premium designs cost more coins per guest.'],
            ['Partiful', 'Yes', 'Guests verify a phone number to RSVP. Built around texting and the app.'],
            ['Punchbowl', 'No', 'Its help center says new events need a paid membership.'],
            ['Greenvelope', 'No', 'Paid by guest count, starting at $19 for 20 guests.'],
            ['RSVPify', 'Yes', 'The free plan closes registration at 100 RSVPs.'],
            ['Canva', 'Yes, for design', 'Great for making the card, but there is no built-in RSVP tracking.'],
            ['Kenji Invites', 'Yes, all of it', 'No ads, no guest accounts or phone check, up to 1,000 guests per invitation, 36 designs, up to 8 photos.'],
          ],
          note: 'Checked October 30, 2026. Prices and plans change, so check each site before you decide.',
        },
      },
      {
        h: 'What you get with Kenji Invites',
        p: ['Everything below is free, for any kind of celebration.'],
        list: [
          'A designed invitation: 21 wedding designs and 15 for birthdays, showers, graduations, holidays and more',
          'Up to 8 of your photos, arranged on the card with faces kept in view',
          'A personal link for each guest, sent by text or email from your own phone, or one shared link for a group chat or QR code',
          "Seat limits per guest, so replies can't go over what you planned",
          'A countdown, map links, calendar buttons and a phone wallpaper for guests',
          'A guest list with every answer, head counts, notes and a spreadsheet download',
          'Co-hosts who see the same list',
        ],
      },
      {
        h: 'When another tool is the better pick',
        p: [
          'We would rather you pick the right tool. Kenji Invites does not sell tickets, run potluck sign-up sheets, or ask custom questions like meal choices beyond a free-text note. If you need those, a ticketing or event-registration tool will serve you better. If you want printed paper invitations mailed for you, a stationery company is the way to go. For a party, a shower, a birthday or a wedding where you want to know who is coming, this does the job for free.',
        ],
      },
    ],
    faq: [
      ['Is Kenji Invites really free?', 'Yes. Designs, photos, sending and RSVP tracking are all free. There are no ads on the invitation your guests see.'],
      ['Do guests need to download an app or give a phone number?', 'No. They open the link in their browser and tap Yes or No. They only share contact details if you use the shared link, so you can reach them with updates.'],
      ['Can I move my guest list over from Evite or a spreadsheet?', 'Yes. Paste your list, one guest per line, with a name, a phone number or email, and how many seats they get.'],
      ['How do invitations get sent?', 'From your own phone or email. Tap Text or Email next to a guest and your phone opens a message with their link already in it.'],
      ['Who makes Kenji Invites?', 'KenjiAI, a small marketing company. It is a free tool we built for families and friends. Your guest list stays private: only you and your co-hosts can see it.'],
    ],
    related: ['rsvp-website', 'templates', 'birthday-invitations', 'wedding-invitations'],
  },
];
