// Content for the Kenji Invites landing pages (/invites/<slug>), one per kind of
// celebration plus a few "how do I..." pages. Each page is prerendered to static
// HTML by scripts/snapshot_routes.mjs + spa_routes.mjs, so everything here is what
// search engines and link previews read. Keep it useful: real wording people can
// copy, real timing advice, and honest answers. No em dashes, no hype.
import type { EventDetails, EventType, ThemeId } from '../shared';

export interface Wording { label: string; lines: string[] }
export interface Topic {
  slug: string;
  /** the wizard opens on this kind of celebration ('' = let them pick) */
  type: EventType | '';
  /** <title> */
  title: string;
  description: string;
  h1: string;
  lead: string;
  /** short name used in links from other pages */
  linkText: string;
  /** sample card(s) at the top */
  sample: { names: [string, string]; details?: EventDetails };
  designs: ThemeId[];
  /** when to send, as [label, answer] rows */
  timing: [string, string][];
  /** what to put on the invitation */
  include: string[];
  wording: Wording[];
  tips: [string, string][];
  faq: [string, string][];
  related: string[];
}

export const TOPICS: Topic[] = [
  {
    slug: 'wedding-invitations',
    type: 'wedding',
    title: 'Free Online Wedding Invitations with RSVP | Kenji Invites',
    description: 'Make a free digital wedding invitation with RSVP tracking. 21 wedding designs, your own photos, a page for every event of the weekend, and replies that land on one guest list. No ads, no guest sign-up.',
    h1: 'Free online wedding invitations with RSVP',
    lead: 'Pick a wedding design, add your photos and the plan for the day, then text or email each guest their own invitation. Every reply lands on one guest list, with the number of seats you gave each household.',
    linkText: 'Wedding invitations',
    sample: { names: ['Grace Turner', 'Michael Reyes'] },
    designs: ['ivory', 'garden', 'chapel', 'beach'],
    timing: [
      ['Save the date', '6 to 8 months out, or 8 to 12 months for a destination wedding'],
      ['The invitation', '6 to 8 weeks before the wedding'],
      ['RSVP by date', '3 to 4 weeks before, so you have time for the caterer and the seating chart'],
      ['A gentle reminder', 'About a week before the RSVP date, to anyone who has not answered'],
    ],
    include: [
      'Both of your names, and your parents if they are hosting',
      'The date, the start time and the venue with its full address',
      'The reception, if it is somewhere else',
      'How many seats are saved for each guest, so nobody guesses about a plus one',
      'An RSVP date',
      'Dress code, parking or hotel notes if they help',
    ],
    wording: [
      { label: 'Traditional, parents hosting', lines: ['Mr. and Mrs. Robert Turner', 'request the honour of your presence', 'at the marriage of their daughter', 'Grace Elizabeth', 'to', 'Michael James Reyes', 'Saturday, the twelfth of June', 'two thousand twenty-seven', 'at half past four in the afternoon', 'St. Mary\'s Chapel, Charleston'] },
      { label: 'The couple hosting', lines: ['Together with their families', 'Grace Turner and Michael Reyes', 'invite you to celebrate their wedding', 'June 12, 2027 at 4:30 PM', 'The Rose Garden, Charleston, South Carolina', 'Dinner and dancing to follow'] },
      { label: 'Relaxed', lines: ['We\'re getting married!', 'Grace & Michael', 'Come eat, drink and dance with us', 'June 12, 2027, 4:30 PM', 'The Rose Garden, Charleston'] },
      { label: 'Small or adults only', lines: ['We are keeping our wedding small', 'and we would love for you to be there.', 'Your invitation is for 2 guests.', 'Please reply by May 15.'] },
    ],
    tips: [
      ['Give each household a seat count', 'On Kenji Invites you set how many seats each guest gets. Their RSVP can\'t go over it, so a "plus one" only happens when you offer one. This one setting saves most couples an awkward phone call.'],
      ['Put the whole weekend on one invitation', 'Rehearsal dinner, welcome drinks, ceremony, reception and the brunch the next day can each have their own time, place and directions. Guests see them in order with a countdown.'],
      ['Send it from your own phone', 'Each guest gets a text or email from you, with their own link in it. People open messages from someone they know. There is no "noreply" email to land in spam.'],
      ['Keep a paper copy for the grandparents', 'Some guests still want something on the fridge. Open the invitation the way a guest sees it, save the card as a picture and print it. If they phone you their answer, record it on your guest list so the count stays right.'],
    ],
    faq: [
      ['Are online wedding invitations OK to send?', 'Yes, and most couples now send at least part of their invitations online. They arrive the same day, nothing gets lost in the mail, and RSVPs come back on their own instead of on little cards. If someone in the family would rather have paper, print theirs.'],
      ['Can I send a save the date first and the invitation later?', 'Yes. Make the invitation, send it as a save the date with just the date and city, then add the venue, times and RSVP date when you know them. Guests use the same link, so it always shows the latest details.'],
      ['How do plus ones work?', 'When you add a guest you choose how many seats they get. If you give someone 2, they can reply for up to 2 people and type their guest\'s name. They can\'t add a third.'],
      ['Can we have more than one event, like a rehearsal dinner?', 'Yes. Add as many events as the weekend has. Each one gets its own time, place, map link and calendar button.'],
      ['Is there a design with a church or a cross?', 'Yes. The Church and Chapel design has stained glass and bells, and you choose whether a cross is shown.'],
    ],
    related: ['bridal-shower-invitations', 'engagement-party-invitations', 'anniversary-invitations', 'rsvp-website'],
  },
  {
    slug: 'birthday-invitations',
    type: 'birthday',
    title: 'Free Birthday Invitation Maker with RSVP | Kenji Invites',
    description: 'Make a free online birthday invitation for any age. Seven party designs, your own photos, and RSVPs that show who is coming and how many. Send by text or email. No ads, no guest sign-up.',
    h1: 'Free birthday invitations, with RSVP built in',
    lead: 'For a first birthday, a kid\'s party, a surprise 40th or Grandma\'s 90th. Add the age and a photo, pick a design, and text each guest their invitation. Their replies show up on your guest list.',
    linkText: 'Birthday invitations',
    sample: { names: ['Maya', ''], details: { age: '40', tagline: 'Dinner, cake and dancing' } },
    designs: ['balloons', 'cake', 'confetti', 'neon'],
    timing: [
      ['Kids\' party', '2 to 3 weeks before. Parents plan weekends early'],
      ['Adult party', '3 to 4 weeks before'],
      ['Milestone (30th, 50th, 80th) or travel', '6 to 8 weeks before'],
      ['RSVP by date', 'About a week before, so you can order the cake and food'],
    ],
    include: [
      'Whose birthday it is, and the age if they don\'t mind',
      'Date, start time, and an end time for kids\' parties so parents know pick-up',
      'The address, plus parking or "ring the side door" notes',
      'Anything to bring or wear: swimsuits, costumes, "no gifts please"',
      'Whether it is a surprise',
      'An RSVP date',
    ],
    wording: [
      { label: 'Kid\'s party', lines: ['Noah is turning 6!', 'Come jump, play and eat cake with us', 'Saturday, May 8, 2 to 4 PM', 'Bounce Town, 120 Oak Street', 'Please let us know by May 1'] },
      { label: 'Adult milestone', lines: ['Please join us to celebrate', 'Maya\'s 40th Birthday', 'Dinner, cake and dancing', 'Friday, June 11 at 7 PM', 'Luca\'s, 45 Main Street'] },
      { label: 'Surprise party', lines: ['Shh! It\'s a surprise.', 'Join us for Dave\'s 50th', 'Saturday, March 6 at 6:30 PM sharp', 'Please park on Elm Street and come in the back door', 'Not a word to Dave!'] },
      { label: 'For a parent or grandparent', lines: ['90 years of Grandma Rose', 'Lunch and stories with the whole family', 'Sunday, April 18 at 1 PM', 'Aunt Carol\'s house', 'Bring your favorite photo of her'] },
    ],
    tips: [
      ['Kids\' parties: seats per family', 'Give each family a seat count, like 3 for one child and two parents. The RSVP asks how many are coming and the names, so you know how many kids versus adults to feed.'],
      ['Surprise parties stay surprises', 'Only the people you send a link to can see the invitation. Guest lists are never shown to other guests, so nobody accidentally forwards it to the birthday person by replying all.'],
      ['Add a photo of the birthday person', 'A baby photo next to a recent one is the classic for big birthdays. You can add up to 8 photos and the card arranges them for you.'],
    ],
    faq: [
      ['Can I make a birthday invitation for free?', 'Yes. Making it, sending it and tracking the RSVPs are all free. There are no ads on the invitation your guests see.'],
      ['Can I send it to a group chat?', 'Yes. Turn on the shared link and post it in a group chat or on a class page. Each person who replies gets added to your guest list with their name. For a known list, sending each guest their own link is better because it remembers who they are.'],
      ['Can I put the age on the invitation?', 'Yes. Type the age and the card shows it, like "40th Birthday". Leave it empty if they would rather not.'],
      ['Does it work for a first birthday?', 'Yes. Use the Balloon Bouquet or Birthday Cake design with a few photos from the year. Grandparents can save the card as a phone wallpaper.'],
    ],
    related: ['quinceanera-invitations', 'graduation-invitations', 'retirement-party-invitations', 'templates'],
  },
  {
    slug: 'baby-shower-invitations',
    type: 'baby',
    title: 'Free Baby Shower Invitations with RSVP | Kenji Invites',
    description: 'Make a free online baby shower invitation with RSVP tracking. Gentle designs, room for the registry link and a gender reveal, and a guest list that fills itself in. No ads, no guest sign-up.',
    h1: 'Free baby shower invitations with RSVP',
    lead: 'Make the invitation in a few minutes, add a bump photo or the ultrasound if you like, and send it by text or email. Your guest list shows who is coming, so you know how many chairs and cupcakes you need.',
    linkText: 'Baby shower invitations',
    sample: { names: ['Ana', 'Luis'], details: { tagline: 'It\'s a girl!', hostedBy: 'Aunt Rosa' } },
    designs: ['nursery', 'balloons', 'garden', 'vellum'],
    timing: [
      ['When to hold it', 'Usually 4 to 8 weeks before the due date'],
      ['The invitation', '4 to 6 weeks before the shower'],
      ['RSVP by date', '1 to 2 weeks before'],
    ],
    include: [
      'The parent or parents-to-be',
      'Who is hosting',
      'Date, time and address',
      'The registry, written in a line or two',
      'Games, a theme or "diapers and wipes welcome" if there is one',
      'Whether partners and kids are invited',
    ],
    wording: [
      { label: 'Classic', lines: ['Please join us for a baby shower honoring', 'Ana Morales', 'Saturday, April 10 at 1 PM', 'Hosted by Aunt Rosa at her home', 'Registered at Target and Amazon'] },
      { label: 'Gender reveal', lines: ['Pink or blue?', 'Find out with us at the baby shower for', 'Ana and Luis', 'Sunday, May 2 at 2 PM', 'Wear what you think it is!'] },
      { label: 'Co-ed', lines: ['A baby is brewing!', 'Join us for a co-ed shower', 'celebrating Ana and Luis', 'Burgers, games and baby gifts', 'Saturday, June 5, 3 PM'] },
      { label: 'Sprinkle for a second baby', lines: ['Baby number two is on the way!', 'Join us for a little sprinkle for Ana', 'Brunch and baby bits', 'Sunday, March 14, 11 AM'] },
    ],
    tips: [
      ['Add the registry to the invitation', 'Put the store names in the short line on the card or in the event notes. Guests see it right above the RSVP.'],
      ['Let a friend co-host', 'Showers are usually thrown by a friend or relative. Send them a co-host link and you both see the same guest list and answers.'],
      ['Plan the food from real numbers', 'Each RSVP says how many people are coming, and the guest list adds them up. Order for that number, not for everyone you invited.'],
    ],
    faq: [
      ['Who usually hosts a baby shower?', 'A close friend, sister, mother or aunt usually hosts. These days it is fine for the parents to host their own too, especially for a co-ed shower.'],
      ['Can I add a photo of the ultrasound?', 'Yes. Add up to 8 photos. The card arranges them and keeps the important part in view.'],
      ['Can people who can\'t come still send a gift?', 'Yes. Put the registry on the invitation so they can find it. When someone answers No, they can leave a note for you too.'],
      ['Does it cost anything?', 'No. Kenji Invites is free, with no ads on the invitation.'],
    ],
    related: ['bridal-shower-invitations', 'birthday-invitations', 'housewarming-invitations', 'rsvp-website'],
  },
  {
    slug: 'bridal-shower-invitations',
    type: 'bridal',
    title: 'Free Bridal Shower Invitations with RSVP | Kenji Invites',
    description: 'Make a free online bridal shower invitation with RSVP. Romantic designs, room for the registry, a bachelorette or brunch on the same invite, and one guest list for the bridesmaids. No ads.',
    h1: 'Free bridal shower invitations with RSVP',
    lead: 'Make a pretty invitation for the bride-to-be, send it by text or email, and keep every answer on one list the bridesmaids can share. Add the brunch or bachelorette as a second event if you like.',
    linkText: 'Bridal shower invitations',
    sample: { names: ['Sarah', ''], details: { tagline: 'Brunch and bubbly', hostedBy: 'the bridesmaids' } },
    designs: ['blush', 'ring', 'garden', 'cheers'],
    timing: [
      ['When to hold it', '2 to 3 months before the wedding'],
      ['The invitation', '4 to 6 weeks before the shower'],
      ['RSVP by date', '1 to 2 weeks before'],
    ],
    include: [
      'The bride-to-be',
      'Who is hosting',
      'Date, time and place',
      'The registry',
      'A theme or dress code if there is one',
      'A rule of thumb: only invite people who are invited to the wedding',
    ],
    wording: [
      { label: 'Classic', lines: ['Please join us for a bridal shower honoring', 'Sarah Johnson', 'Saturday, April 17 at 11 AM', 'The Garden Room, 18 Main Street', 'Hosted by the bridesmaids'] },
      { label: 'Brunch', lines: ['Brunch and bubbly for the bride-to-be', 'Sarah', 'Sunday, May 2 at 11 AM', 'Mimosas, waffles and a lot of love'] },
      { label: 'Tea party', lines: ['She found her perfect match', 'Join us for tea in honor of Sarah', 'Saturday, April 24, 2 PM', 'Registered at Crate and Barrel'] },
    ],
    tips: [
      ['One list for every host', 'Bridesmaids can all be co-hosts, so whoever is in charge of food sees the same head count as whoever is in charge of games.'],
      ['Add the bachelorette as a second event', 'If the same group is going, add it to the invitation with its own time and place. Guests can save both to their calendar.'],
    ],
    faq: [
      ['Who should be invited to a bridal shower?', 'Close family and friends who are also invited to the wedding. Inviting someone to the shower but not the wedding is the one rule most people agree on.'],
      ['Can I make it a surprise for the bride?', 'Yes. Only the people you send links to see the invitation.'],
      ['Is it really free?', 'Yes. No ads, no paid upgrades to send it, and guests do not need an account.'],
    ],
    related: ['wedding-invitations', 'baby-shower-invitations', 'engagement-party-invitations', 'templates'],
  },
  {
    slug: 'graduation-invitations',
    type: 'graduation',
    title: 'Free Graduation Party Invitations with RSVP | Kenji Invites',
    description: 'Make a free graduation party or open house invitation with RSVP. Add the school, class year and senior photos, list the ceremony and the party, and see who is coming. No ads, no guest sign-up.',
    h1: 'Free graduation party invitations',
    lead: 'High school, college, nursing school or kindergarten. Add the school and class year, a few senior photos, the ceremony and the party, and send it to family and friends from your phone.',
    linkText: 'Graduation invitations',
    sample: { names: ['Jordan Lee', ''], details: { school: 'Lincoln High School', classYear: '2027' } },
    designs: ['gradcap', 'confetti', 'midnight', 'emerald'],
    timing: [
      ['Open house or party', '3 to 4 weeks before'],
      ['If guests are traveling', '6 to 8 weeks before'],
      ['RSVP by date', 'A week before, so you can plan food'],
    ],
    include: [
      'The graduate\'s name, school and class year',
      'The degree or program, for college and grad school',
      'The ceremony time and place, if guests are invited to it',
      'The party or open house, with start and end times',
      'Senior photos',
    ],
    wording: [
      { label: 'High school open house', lines: ['Please join us to celebrate the graduation of', 'Jordan Lee', 'Lincoln High School, Class of 2027', 'Open house Saturday, June 5, 1 to 5 PM', 'Stop by any time'] },
      { label: 'College', lines: ['She did it!', 'Join us to celebrate', 'Priya Shah, B.S. in Nursing', 'University of Michigan, 2027', 'Dinner Saturday, May 1 at 6 PM'] },
      { label: 'Short and sweet', lines: ['Caps off to Jordan!', 'Class of 2027', 'Backyard party, June 12, 4 PM'] },
    ],
    tips: [
      ['Put the ceremony and the party on one invitation', 'Add the ceremony as its own event with the arena or school address, and the party as another. Guests get a map link and calendar button for each.'],
      ['Open houses: the shared link works well', 'For an open house, turn on the shared link and post it in a family group chat. Each person who replies is added to your list with how many people they are bringing.'],
    ],
    faq: [
      ['What is the difference between a graduation announcement and an invitation?', 'An announcement shares the news. An invitation asks people to come to something, like the ceremony or a party, and asks them to RSVP.'],
      ['Can I add more than one senior photo?', 'Yes, up to 8. The card arranges them, and guests can swipe through them full size.'],
      ['Can two graduates share one party invitation?', 'Yes. Make it as a custom celebration, give it a name like "Jordan and Ava\'s Graduation Party", and add both of their photos.'],
    ],
    related: ['birthday-invitations', 'family-reunion-invitations', 'rsvp-website', 'templates'],
  },
  {
    slug: 'engagement-party-invitations',
    type: 'engagement',
    title: 'Free Engagement Party Invitations with RSVP | Kenji Invites',
    description: 'Make a free online engagement party invitation with RSVP. Ring and champagne designs, your engagement photos, and a guest list with every answer. No ads, no guest sign-up.',
    h1: 'Free engagement party invitations',
    lead: 'Share the news and get everyone together. Add your engagement photos, pick a design, and send each guest their own invitation from your phone.',
    linkText: 'Engagement party invitations',
    sample: { names: ['Sarah', 'James'], details: { tagline: 'She said yes!' } },
    designs: ['ring', 'cheers', 'blush', 'midnight'],
    timing: [
      ['When to hold it', 'Usually within 3 months of getting engaged'],
      ['The invitation', '3 to 6 weeks before the party'],
      ['RSVP by date', '1 to 2 weeks before'],
    ],
    include: ['Both names', 'Who is hosting, often the parents', 'Date, time and place', 'Your engagement photos', '"No gifts, please" if you mean it'],
    wording: [
      { label: 'Parents hosting', lines: ['Mr. and Mrs. David Johnson', 'invite you to an engagement party', 'in honor of Sarah and James', 'Saturday, March 20 at 7 PM'] },
      { label: 'Relaxed', lines: ['She said yes!', 'Come celebrate Sarah & James', 'Drinks and dinner on us', 'Friday, February 26, 7 PM, The Wharf'] },
    ],
    tips: [
      ['Use it as your save the date too', 'If you know the wedding date, put it in the short line on the card. Later, make the wedding invitation for the same guests.'],
      ['Only invite people you plan to invite to the wedding', 'It is the same rule as the shower. The guest list here is a good start for the wedding list.'],
    ],
    faq: [
      ['Who hosts an engagement party?', 'Traditionally the bride\'s parents, but anyone can: both families, friends, or the couple themselves.'],
      ['Can I add our engagement photos?', 'Yes, up to 8, and they are arranged on the card for you.'],
      ['Is it free?', 'Yes, with no ads on the invitation and nothing for guests to sign up for.'],
    ],
    related: ['wedding-invitations', 'bridal-shower-invitations', 'anniversary-invitations', 'templates'],
  },
  {
    slug: 'anniversary-invitations',
    type: 'anniversary',
    title: 'Free Anniversary Party Invitations with RSVP | Kenji Invites',
    description: 'Make a free 25th, 40th or 50th anniversary party invitation with RSVP. Add their wedding photo next to a recent one, invite the whole family by text, and see who is coming. No ads.',
    h1: 'Free anniversary party invitations',
    lead: 'For a 25th, a 50th, or a vow renewal. Put their wedding photo next to one from today, add the number of years, and send it to the whole family. Older relatives just tap the link, no app or account.',
    linkText: 'Anniversary invitations',
    sample: { names: ['Mary', 'Tom'], details: { years: '50', tagline: 'Fifty years and still dancing', hostedBy: 'their children' } },
    designs: ['renewal', 'cheers', 'ivory', 'emerald'],
    timing: [
      ['The invitation', '4 to 6 weeks before'],
      ['If family is traveling', '2 to 3 months before'],
      ['RSVP by date', '2 weeks before'],
    ],
    include: ['Both names and the number of years', 'Who is hosting, often the children', 'Date, time and place', 'A wedding photo and a recent one', '"Your presence is the only gift" if you mean it'],
    wording: [
      { label: '50th, hosted by the children', lines: ['The children of Mary and Tom Wilson', 'invite you to celebrate', 'their 50th wedding anniversary', 'Saturday, September 18 at 5 PM', 'St. Joseph\'s Hall', 'Your presence is the only gift they wish for'] },
      { label: 'Vow renewal', lines: ['Twenty-five years later,', 'Mary and Tom are saying I do again', 'Please join us for their vow renewal', 'Saturday, June 19 at 4 PM'] },
      { label: 'Surprise', lines: ['It\'s a surprise!', '40 years of Mom and Dad', 'Dinner Saturday, October 9 at 6 PM', 'Please arrive by 5:45'] },
    ],
    tips: [
      ['Make it easy for older guests', 'The invitation opens in any phone browser with big, clear text. There is nothing to download and no password. Guests can tap to call for directions or add it to their calendar.'],
      ['Ask cousins to bring photos', 'Put "bring a favorite photo of Mom and Dad" in the short line. It makes the party.'],
    ],
    faq: [
      ['What are the traditional anniversary gifts?', 'Silver for the 25th, ruby for the 40th and gold for the 50th are the ones most people know. Many couples ask for no gifts and just want everyone there.'],
      ['Can grandchildren help send the invitations?', 'Yes. Add them as co-hosts with a one-time link, and they see the same guest list and can send invitations from their own phones.'],
      ['Is it free?', 'Yes. No ads and no sign-up for guests.'],
    ],
    related: ['wedding-invitations', 'retirement-party-invitations', 'family-reunion-invitations', 'templates'],
  },
  {
    slug: 'quinceanera-invitations',
    type: 'quince',
    title: 'Free Quinceañera and Sweet 16 Invitations with RSVP | Kenji Invites',
    description: 'Make a free quinceañera or sweet 16 invitation with RSVP. Tiara and rose designs, the Mass and the reception on one invitation, photos, and a guest list for the whole family. No ads.',
    h1: 'Free quinceañera and sweet 16 invitations',
    lead: 'Put the Mass and the reception on one invitation, add her photos, and send it to family near and far. Each household gets the number of seats you choose, and you see every answer in one place.',
    linkText: 'Quinceañera invitations',
    sample: { names: ['Sofia Ramirez', ''], details: { milestone: 'Quinceañera', tagline: 'Mis XV años' } },
    designs: ['crown', 'balloons', 'neon', 'blush'],
    timing: [
      ['The invitation', '6 to 8 weeks before'],
      ['Family coming from out of town', '3 months before'],
      ['RSVP by date', '3 weeks before, for the hall and the caterer'],
    ],
    include: ['Her name and the celebration (Quinceañera, Sweet 16, Sweet 15)', 'Her parents and padrinos if you like', 'The Mass: church, address and time', 'The reception: hall, address and time', 'Dress code', 'Seats per family'],
    wording: [
      { label: 'Quinceañera', lines: ['With the blessing of God and our parents', 'Sofia Ramirez', 'invites you to celebrate her Quinceañera', 'Mass at 2 PM, St. Anne\'s Church', 'Reception to follow at 6 PM, Grand Plaza Hall'] },
      { label: 'Bilingual', lines: ['Mis XV años', 'Sofia Ramirez', 'Te invito a celebrar conmigo', 'Please join me as I celebrate my fifteenth birthday', 'Sábado 14 de agosto / Saturday, August 14'] },
      { label: 'Sweet 16', lines: ['Sixteen and fabulous', 'Join us for Emma\'s Sweet 16', 'Saturday, May 22 at 7 PM', 'Dress to impress'] },
    ],
    tips: [
      ['Mass and reception as two events', 'Add the Mass as one event and the reception as another. Each has its own map link and calendar button, so nobody goes to the wrong place.'],
      ['Seats per family keep the hall count right', 'Give each family the number of seats you are paying for. Their RSVP can\'t go higher, and the list adds up the total for the caterer.'],
    ],
    faq: [
      ['Can the invitation be in Spanish?', 'Yes. Type your own wording in Spanish, English or both. The short line on the card and the event names are all yours to write.'],
      ['Can padrinos be listed?', 'Yes. Put them in the short line on the card or in the notes for the Mass or reception.'],
      ['Is it free?', 'Yes. No ads, and guests do not need an account.'],
    ],
    related: ['birthday-invitations', 'bar-mitzvah-invitations', 'graduation-invitations', 'templates'],
  },
  {
    slug: 'bar-mitzvah-invitations',
    type: 'mitzvah',
    title: 'Free Bar and Bat Mitzvah Invitations with RSVP | Kenji Invites',
    description: 'Make a free bar mitzvah, bat mitzvah or b\'nai mitzvah invitation with RSVP. The service, kiddush and party on one invitation, Star of David and modern designs, and a guest list with seat counts.',
    h1: 'Free bar and bat mitzvah invitations',
    lead: 'Put the service, the kiddush luncheon and the party on one invitation. Choose the Star of David design or something modern, and send each family their own link with their seat count.',
    linkText: 'Bar and bat mitzvah invitations',
    sample: { names: ['Noah Cohen', ''], details: { milestone: 'Bar Mitzvah', tagline: 'Called to the Torah' } },
    designs: ['mitzvah', 'midnight', 'deco', 'confetti'],
    timing: [
      ['Save the date', '6 to 12 months before'],
      ['The invitation', '6 to 8 weeks before'],
      ['RSVP by date', '3 to 4 weeks before'],
    ],
    include: ['The child\'s name and Hebrew name if you like', 'The service, synagogue and time', 'The kiddush or luncheon', 'The evening party, if it is separate', 'Seats per family, and whether kids are invited to the party'],
    wording: [
      { label: 'Traditional', lines: ['With joy we invite you', 'to worship with us as our son', 'Noah', 'is called to the Torah as a Bar Mitzvah', 'Saturday, the fifth of June at ten o\'clock', 'Temple Beth Shalom'] },
      { label: 'Bat mitzvah', lines: ['Please join us as our daughter', 'Leah', 'becomes a Bat Mitzvah', 'Saturday, October 16 at 10 AM', 'Kiddush luncheon to follow'] },
      { label: 'Party only', lines: ['Noah\'s Bar Mitzvah party', 'Dinner, dancing and a photo booth', 'Saturday, June 5 at 7 PM'] },
    ],
    tips: [
      ['Service, luncheon and party as separate events', 'Each one gets its own time and place. Guests see them in order and can add each to their calendar.'],
      ['Kid friends and adult guests', 'Use seat counts: 1 for a classmate coming to the party, 2 or more for families.'],
    ],
    faq: [
      ['What is a b\'nai mitzvah?', 'A shared ceremony for more than one child, often twins or siblings. Pick B\'nai Mitzvah and type both names in the name box, like Noah and Leah.'],
      ['Is there a Star of David design?', 'Yes, in navy and silver. You can change its colors if you want.'],
      ['Is it free?', 'Yes. No ads, no guest accounts.'],
    ],
    related: ['quinceanera-invitations', 'birthday-invitations', 'family-reunion-invitations', 'templates'],
  },
  {
    slug: 'retirement-party-invitations',
    type: 'retirement',
    title: 'Free Retirement Party Invitations with RSVP | Kenji Invites',
    description: 'Make a free retirement party invitation with RSVP for a coworker, parent or friend. Send it by text or email, or post one link in the team chat, and see who is coming. No ads.',
    h1: 'Free retirement party invitations',
    lead: 'For a coworker after 32 years, or Dad finally hanging it up. Write a line about the career, add a photo, and send it to family by text or post one link in the team chat.',
    linkText: 'Retirement party invitations',
    sample: { names: ['Linda Park', ''], details: { tagline: 'After 32 wonderful years at Acme', hostedBy: 'the whole team' } },
    designs: ['sunset', 'cheers', 'confetti', 'emerald'],
    timing: [
      ['The invitation', '3 to 4 weeks before'],
      ['Former coworkers or travel', '6 weeks before'],
      ['RSVP by date', '1 week before'],
    ],
    include: ['Their name and years of service', 'Who is hosting', 'Date, time, place', 'Whether it is a surprise', 'Collection for a gift, if there is one'],
    wording: [
      { label: 'Work party', lines: ['After 32 wonderful years', 'please join us to celebrate', 'Linda Park', 'Friday, June 4 at 4 PM', 'Main conference room, cake and toasts'] },
      { label: 'Family party', lines: ['He\'s officially retired!', 'Come celebrate Dad\'s next chapter', 'Backyard barbecue, Saturday, July 10 at 3 PM'] },
      { label: 'Funny', lines: ['Linda is retiring.', 'Her alarm clock is not invited.', 'Join us Friday at 5 PM at The Tap Room'] },
    ],
    tips: [
      ['Post one link in the team chat', 'Turn on the shared link and post it in Slack, Teams or email. Each person types their name when they reply, and the list fills in.'],
      ['Invite former coworkers too', 'Text them the same link. They don\'t need a company email or an account.'],
    ],
    faq: [
      ['Can I use it for a work event?', 'Yes. It is free for work events too, and there are no ads.'],
      ['Can people outside the company reply?', 'Yes. Anyone with the link can reply. Only you see the guest list.'],
    ],
    related: ['business-event-invitations', 'anniversary-invitations', 'birthday-invitations', 'templates'],
  },
  {
    slug: 'housewarming-invitations',
    type: 'housewarming',
    title: 'Free Housewarming Party Invitations with RSVP | Kenji Invites',
    description: 'Make a free housewarming invitation with RSVP. Add a photo of the new place, directions and parking notes, and see who is coming. Send by text or email. No ads, no guest sign-up.',
    h1: 'Free housewarming invitations',
    lead: 'Show off the new place. Add a photo of the house, the address with a map link, and parking notes, then text it to friends and neighbors.',
    linkText: 'Housewarming invitations',
    sample: { names: ['The Garcias', ''], details: { tagline: 'Food, drinks and a tour' } },
    designs: ['house', 'kraft', 'boho', 'garden'],
    timing: [['The invitation', '2 to 3 weeks before'], ['RSVP by date', 'A few days before']],
    include: ['Your names', 'The new address, with parking notes', 'Start and end time for an open house', 'Food and drinks, or "bring a dish"', '"No gifts needed" if you mean it'],
    wording: [
      { label: 'Open house', lines: ['We finally have a place to call home!', 'Stop by for food, drinks and a tour', 'Saturday, April 3, 2 to 6 PM', '14 Maple Lane'] },
      { label: 'Short', lines: ['New keys, new place, come see it!', 'Housewarming at the Garcias\'', 'Sunday, May 9 at 1 PM'] },
    ],
    tips: [['Directions that work', 'The address on the invitation opens in the guest\'s maps app. Add "park on the street, we\'re the blue door" in the notes.'], ['Invite the neighbors', 'Print the QR code and put it on a note in their mailbox. They scan it and reply on their phone.']],
    faq: [
      ['Do I need to send a gift list?', 'No. Most housewarmings are casual. If people ask, a line like "just bring yourselves" or "a plant for the garden" is plenty.'],
      ['Is it free?', 'Yes. No ads, no guest accounts.'],
    ],
    related: ['holiday-party-invitations', 'birthday-invitations', 'baby-shower-invitations', 'templates'],
  },
  {
    slug: 'holiday-party-invitations',
    type: 'holiday',
    title: 'Free Holiday and Christmas Party Invitations with RSVP | Kenji Invites',
    description: 'Make a free holiday party, Christmas party or Friendsgiving invitation with RSVP. Evergreen and champagne designs, a gift exchange as a second event, and a guest list with head counts. No ads.',
    h1: 'Free holiday party invitations',
    lead: 'Christmas parties, Friendsgiving, Hanukkah nights, New Year\'s Eve, the office party or the family dinner. Pick a design, add the gift exchange if there is one, and see who is coming.',
    linkText: 'Holiday party invitations',
    sample: { names: ['', ''], details: { eventName: 'Holiday Party', hostedBy: 'the Millers', tagline: 'Cocoa, cookies and carols' } },
    designs: ['winter', 'cheers', 'midnight', 'emerald'],
    timing: [
      ['December parties', 'Send by mid November. December weekends fill up fast'],
      ['Friendsgiving', '3 to 4 weeks before'],
      ['New Year\'s Eve', 'Early December'],
      ['RSVP by date', '1 week before'],
    ],
    include: ['The party name', 'Date, time and address', 'Dress code: ugly sweaters, cocktail, pajamas', 'Gift exchange rules and the price limit', '"Bring a dish" with a sign-up, for potlucks'],
    wording: [
      { label: 'Christmas party', lines: ['The Millers\' Holiday Party', 'Cocoa, cookies and carols', 'Saturday, December 13 at 7 PM', 'Ugly sweaters strongly encouraged'] },
      { label: 'Friendsgiving', lines: ['Friendsgiving 2026', 'We\'ve got the turkey. You bring a side.', 'Saturday, November 21 at 5 PM'] },
      { label: 'Gift exchange', lines: ['White Elephant Night', 'Bring one wrapped gift, $25 or less', 'Friday, December 18 at 8 PM'] },
      { label: 'New Year\'s Eve', lines: ['Out with the old, in with the new', 'New Year\'s Eve at our place', 'December 31, 9 PM until midnight and after'] },
    ],
    tips: [
      ['Add the gift exchange as its own event', 'Give it a time and put the rules and price limit in its notes. Everyone sees it on the invitation.'],
      ['Send early in the season', 'Invitations sent before Thanksgiving get the best turnout for December weekends.'],
    ],
    faq: [
      ['Can I use it for an office holiday party?', 'Yes. Post the shared link in the team chat, and each person replies with their name and how many are coming. Free, no ads.'],
      ['Can guests say what dish they are bringing?', 'Yes. The RSVP has a note box. They can write what they are bringing and you see it on the guest list.'],
      ['Is it free?', 'Yes. No ads, no guest accounts.'],
    ],
    related: ['business-event-invitations', 'housewarming-invitations', 'family-reunion-invitations', 'templates'],
  },
  {
    slug: 'business-event-invitations',
    type: 'business',
    title: 'Free Business Event and Launch Invitations with RSVP | Kenji Invites',
    description: 'Make a free invitation for a launch, grand opening, open house, gala or client dinner, with RSVP tracking and seat counts. Clean modern designs, no ads, and guests never need an account.',
    h1: 'Free business event invitations with RSVP',
    lead: 'Product launches, grand openings, client dinners, open houses and galas. A clean design, your logo or photos, a schedule for the evening, and an RSVP list you can export.',
    linkText: 'Business event invitations',
    sample: { names: ['', ''], details: { eventName: 'The Spring Launch', company: 'Bright Co.', tagline: 'Drinks, demos and good company' } },
    designs: ['launch', 'blacktie', 'minimal', 'deco'],
    timing: [['The invitation', '3 to 4 weeks before'], ['Galas and conferences', '6 to 8 weeks before'], ['RSVP by date', '1 week before']],
    include: ['Event name and your company', 'Date, time, venue and parking', 'Schedule: reception, talks, dinner', 'Dress code', 'Seats per guest, if a plus one is allowed'],
    wording: [
      { label: 'Launch', lines: ['You\'re invited to The Spring Launch', 'Drinks, demos and good company', 'Thursday, April 15 at 6 PM', 'Bright Co. Studio, 200 Market Street'] },
      { label: 'Grand opening', lines: ['We\'re open!', 'Join us for the grand opening of Rosa\'s Bakery', 'Saturday, May 1, 9 AM to noon', 'Free coffee and a sample for every guest'] },
      { label: 'Client dinner', lines: ['A thank you dinner for our clients', 'Wednesday, November 18 at 7 PM', 'The Oak Room', 'Your invitation is for 2 guests'] },
    ],
    tips: [['Seat counts for venues with a limit', 'Give each guest 1 or 2 seats. Replies can\'t go over, and the list shows your total against the room.'], ['Schedule on the invitation', 'Add the reception, talks and dinner as separate events so guests know when to arrive.']],
    faq: [
      ['Can I use it for business, not just parties?', 'Yes. It is free for business events too. Guests see your event, not ads.'],
      ['Can I get the guest list out?', 'Yes. Your guest list shows every reply, how many are coming and any notes, and you can download it as a spreadsheet.'],
    ],
    related: ['retirement-party-invitations', 'holiday-party-invitations', 'rsvp-website', 'templates'],
  },
  {
    slug: 'family-reunion-invitations',
    type: 'reunion',
    title: 'Free Family Reunion and Class Reunion Invitations with RSVP | Kenji Invites',
    description: 'Make a free family reunion or class reunion invitation with RSVP. A whole weekend of events on one invitation, head counts per family, and a link anyone can reply on. No ads, no guest sign-up.',
    h1: 'Free family reunion and class reunion invitations',
    lead: 'Get everyone together again. Put the welcome night, the picnic and the farewell brunch on one invitation, and let each family tell you how many are coming.',
    linkText: 'Reunion invitations',
    sample: { names: ['', ''], details: { eventName: 'Johnson Family Reunion', hostedBy: 'Aunt Carol', tagline: 'Bring your old photos' } },
    designs: ['polaroid', 'sunset', 'confetti', 'kraft'],
    timing: [['Save the date', '6 to 12 months before'], ['The invitation', '2 to 3 months before'], ['RSVP by date', '3 to 4 weeks before']],
    include: ['Reunion name and who is organizing', 'Every event of the weekend with times and places', 'Hotel block or camping info', 'What to bring', 'T-shirt sizes or a cost per family, in the notes'],
    wording: [
      { label: 'Family', lines: ['The Johnson Family Reunion', 'Three generations, one weekend', 'July 9 to 11, Lake Harmon Park', 'Bring your old photos and your appetite'] },
      { label: 'Class', lines: ['Lincoln High, Class of 2006', '20 years. Can you believe it?', 'Saturday, August 15 at 7 PM', 'The Legion Hall'] },
    ],
    tips: [['A shared link for the whole family tree', 'You probably don\'t have everyone\'s number. Turn on the shared link and let cousins pass it around. Each reply lands on your list with a name and head count.'], ['A weekend schedule', 'Add each event with its own time, place and notes. Guests see the whole weekend in order.']],
    faq: [
      ['How do I reach relatives I don\'t have contact info for?', 'Post the shared link in the family group chat or on Facebook. Anyone with it can reply, and only you see the list.'],
      ['Can I ask for T-shirt sizes?', 'Ask guests to put their sizes in the note when they reply. You see every note on the guest list.'],
      ['Is it free?', 'Yes. No ads, no guest accounts.'],
    ],
    related: ['anniversary-invitations', 'graduation-invitations', 'holiday-party-invitations', 'rsvp-website'],
  },
];

/** Every landing page slug, including the non-event pages. Order = order in "More ideas" lists. */
export const EXTRA_PAGES: { slug: string; linkText: string }[] = [
  { slug: 'rsvp-website', linkText: 'Free RSVP website' },
  { slug: 'evite-alternative', linkText: 'A free Evite alternative' },
  { slug: 'templates', linkText: 'All invitation designs' },
];

export const topicBySlug = (slug: string) => TOPICS.find((t) => t.slug === slug);
export const linkTextOf = (slug: string) => topicBySlug(slug)?.linkText || EXTRA_PAGES.find((p) => p.slug === slug)?.linkText || slug;
/** the landing page for a kind of celebration, used by the guest page "make your own" link */
export const topicForType = (type: EventType) => TOPICS.find((t) => t.type === type)?.slug || '';
