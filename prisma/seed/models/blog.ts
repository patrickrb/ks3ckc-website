import { prisma } from 'prisma/seed/utils';

type SeedBlog = {
  title: string;
  content: string;
  tags: string[];
};

const POSTS: SeedBlog[] = [
  {
    title: 'Field Day 2025 — 3A KS, dirt and DX',
    tags: ['field-day', 'contest', 'antenna'],
    content: `Field Day this year hit different. We rolled into Clinton State Park
on Friday afternoon, threw up an EFHW between two oaks, dropped a hexbeam on a
crank-up tower, and discovered — yet again — that nothing is RF-quiet at 3am
when somebody fires up a generator three sites over.

Final tally: **812 QSOs**, 96 sections, ~2 dozen first contacts for new hams.
Best DX was a JA on 15m FT8 around grayline. Worst moment was when the GOTA
station's coax got rolled over by the food truck.

Lessons learned, roughly in order of pain:

- pre-tune your antennas at home. you will not have time on day-of.
- bring 2x the velcro you think you need.
- somebody always forgets the chairs. it will not be you. but somebody.

Logs are uploaded to N1MM+ and the cabrillo file is in the club drive. CW ops
get the gold star this year — 38% of our points came from CW with one rig.`,
  },
  {
    title: 'Antenna build log: 40m EFHW, 71ft of wire and a 49:1 unun',
    tags: ['antenna', 'build-log', 'hf'],
    content: `Built a 40m end-fed half-wave for portable ops. Total cost: ~$22
in parts plus a saturday afternoon. SWR is under 1.5:1 on 40/20/15/10 with no
tuner. 30m needs the tuner but it'll match.

**BOM:**
- FT240-43 toroid
- 22 AWG enameled wire (about 3ft for the secondary, 7 turns primary)
- 100pF 3kV ceramic cap across the primary
- weatherproof box from the dollar store
- 14 AWG silicone wire for the radiator

The unun is a 49:1 with a small compensation cap. wound 2:14, it's the
classic K1RF/Steve Ellington design. Tuned with a NanoVNA — bring the antenna
up to height before you trim, otherwise you'll chase your tail.

Throws over a tree branch with a tennis ball + arborist line. Total deploy
time: under 4 minutes if you're not a perfectionist about the slope.`,
  },
  {
    title: 'POTA activation #14 — K-2284, 3 hours, 62 contacts',
    tags: ['pota', 'portable', 'qrp'],
    content: `Activated **K-2284 (Lewis & Clark State Historic Site)** on Saturday.
Beautiful weather, no bugs (yet), and the antenna behaved.

Setup was the usual: KX2 at 10w, 40m EFHW slung over a fishing pole, AX1 in
the bag as backup. Logged direct in HAMRS, exported to ADIF on the way home.

Highlights:
- park-to-park with a New Hampshire op who was running 2.5w. perfect copy.
- a curious park ranger who wanted to know if we were "doing the cell tower
  thing." gave him an ARRL pamphlet.
- the obligatory 17m JA on FT8 about an hour before pack-up.

Total: 62 contacts in 3 hours, 8 P2P, 4 DX. KX2 battery still showed 11.6V
after the session. ~$150 of gear is enough to do this. you don't need a yacht.`,
  },
  {
    title: 'Why your HT sounds like garbage on the repeater',
    tags: ['vhf', 'repeater', 'troubleshooting'],
    content: `Showed up to the Wednesday night net and three different HTs were
sounding like a garbage disposal. Common reasons, in roughly the order I'd
check them:

1. **Battery sag.** under load your 7.4V pack is sitting at 6.8V and the PA
   is starting to misbehave. swap to AA tray or a fresh pack and re-key.
2. **Mic gain too hot.** if you're shouting at the radio, back off. the
   ALC is clipping. it's a feature.
3. **Wrong CTCSS.** you're on tone 100.0 instead of 107.2 and you're not
   actually keying the repeater up — you're just splattering on the input.
4. **Loose antenna.** check the SMA. half-screwed antennas detune the front
   end and create some really creative IMD.

If you're hearing your own audio sound bad — record yourself off another
radio. live monitoring on the HT itself lies.`,
  },
  {
    title: 'CW practice net is back — Tuesdays at 8pm CT, 28.060',
    tags: ['cw', 'net', 'training'],
    content: `Bringing back the slow CW practice net. Tuesdays 8pm CT, 28.060
MHz (10m), with NCS rotating between AC0DZ, N0RC, and KC0NOR.

Format:
- 8:00 — call CQ at 8 wpm, send slowly
- 8:10 — round-robin, each station sends a 5-line bio
- 8:30 — head copy practice (no pencil, no laptop)
- 8:45 — ragchew until everybody bails

Code from QRS up is welcome. We don't care if you fist a backwards K. The
goal is on-air time, not contest speed. If 10m is dead we drop to 7.040.`,
  },
  {
    title: 'Mesh node: the LoRa nightmare you actually want',
    tags: ['meshtastic', 'lora', 'build-log'],
    content: `Stood up a Meshtastic node on the roof. Heltec V3, GPS, 915 MHz,
3W solar panel + 18650. Total elevation about 24ft AGL above a ranch house.

Coverage is surprisingly good — clean LoRa packets from 11 miles away through
a couple of hills, ~3 miles in dense suburbia, and one anomalous report from
21 miles out that I'm pretty sure was a tropo duct.

The annoying part: Meshtastic firmware churn is brutal. between v2.3 and v2.4
the position frame format changed, the role enums got renumbered, and my
external GPS stopped enumerating. allow yourself an evening to debug. don't
do firmware updates the night of a club meeting.

ham radio adjacent? sure. fun? extremely. tell your spouse it's "for emcomm."`,
  },
  {
    title: 'A defense of the straight key',
    tags: ['cw', 'opinion'],
    content: `I know, I know. paddles are faster. an electronic keyer is more
consistent. all true.

I keep coming back to the straight key because it's the one piece of ham
radio gear where the operator is **unambiguously** the bottleneck. you can't
hide behind a fancy keyer's iambic timing. it's just you, a piece of metal,
and a spring. either you can send "the quick brown fox" cleanly at 14 wpm,
or you can't.

There's also the connection thing. a 1940s straight key sends the same dits
and dahs my grandfather sent. the medium hasn't changed. nothing else in
electronics is like that.

If you've never owned one, get a Kent. or a Vibroplex. or a $30 Chinese clone
on eBay. set it up at the club shack and try a 5-minute QSO. you will be
humbled. that's the point.`,
  },
  {
    title: 'Repeater #2 is back on the air — 444.875+ PL 107.2',
    tags: ['repeater', 'announcement', 'uhf'],
    content: `After 6 weeks of "we're working on it," repeater #2 is back.
The duplexer was sucking 4dB more than spec on the high side, the controller
had a stuck-on PTT line from a coffee incident in 2022, and the cabinet fan
finally died.

**Specs:**
- 444.875 +5 MHz, PL 107.2 in/out
- coverage: ~25 miles to the south, ~35 miles north (terrain favors north)
- linked to repeater #1 (146.910-) on the club's reflector

If you can't hit it from where you used to, that's not us — it's the new
fence on the tower site that's eating about 1.5dB. we're working on it.

Thanks to KD0LRN and WB0WAO for crawling around in the dust.`,
  },
  {
    title: 'License upgrade study notes — Extra in 90 days',
    tags: ['licensing', 'training', 'study'],
    content: `Passed Extra last weekend. 47/50. notes for anyone walking the
same path:

**What worked:**
- HamStudy.org's "fast track" mode. just grind it.
- the W4EEY youtube series for the math (smith chart, decibels, transformers)
- printing the formula sheet and taping it next to the bathroom mirror
- doing one full mock exam every 3rd day, increasing in spacing

**What didn't:**
- trying to "understand" every question. some are just memorize-and-move-on.
- reading the ARRL book cover-to-cover. great reference, terrible curriculum.
- studying tired. 30 minutes of focused study > 2 hours of scrolling questions.

The exam itself was less brutal than I expected. about a third of the
questions were obvious freebies, a third were "you've seen this," and a
third were "I think it's B and I'm moving on."`,
  },
  {
    title: 'On the magic of grayline propagation',
    tags: ['propagation', 'hf', 'dx'],
    content: `Worked a VK on 40m last week, 0530 local, with 100w into a low
dipole. on 40m. from kansas. that's not supposed to happen.

Grayline propagation is the kind of thing you learn about in the licensing
manual and then promptly forget exists, because most of the time you're
operating during the day on 20m and the F-layer is doing its predictable
thing. but for ~30 minutes around sunrise/sunset, the absorption layer (D)
collapses while the reflective layer (F) stays alive, and signals can
propagate along the terminator with very low loss.

Practical effect: at gray-line, you can sometimes work weak DX on low bands
with modest setups that have no business reaching that far. it's a small
window, but if you're up early or staying up late, it pays off.

A nice side effect: working stations along grayline tends to produce some of
the most beautiful, stable, fading-free CW signals you'll ever copy.`,
  },
  {
    title: 'Reading: "Experimental Methods in RF Design" — worth it?',
    tags: ['reading', 'opinion', 'rf'],
    content: `Yes. with caveats.

EMRFD (Hayward, Campbell, Larkin) is the closest thing the homebrew RF world
has to a standard textbook. it's terse, sometimes dated, and assumes you've
already gotten through ARRL Handbook chapters on transmission lines and
mixers. it does **not** hold your hand.

But — if you've ever wanted to actually design a receiver from first
principles, work out the gain distribution, choose IF frequencies on purpose
instead of "because the BFO crystal was in the junk box," EMRFD is the book.

Don't read it linearly. pick a project — say, a 40m direct-conversion rx —
and use EMRFD as a reference. you'll get more out of 30 pages used in anger
than 300 pages read passively.`,
  },
  {
    title: 'Club shack inventory: what we actually use vs what gathers dust',
    tags: ['club', 'gear', 'opinion'],
    content: `Did the annual shack inventory last weekend. some honest notes
on what gets used and what doesn't.

**Daily drivers:**
- the FT-991A. it's not the best at anything but it's good at everything.
- the EFHW antenna (40m through 10m, no tuner needed)
- the cheap NanoVNA. punches way above its price.
- the bench power supply. obviously.

**Used occasionally:**
- the IC-7300. nicer radio than the 991A but the rear-panel cable mess
  means nobody wants to disturb it.
- the old TS-440S. fires up once a year for "vintage night."

**Gathering dust:**
- the analog wattmeter from 1987. great relic, nobody trusts it.
- two CB radios somebody donated. we're not using them but we feel weird
  throwing them out.
- the manual antenna tuner. autotuners ruined us all.

Inventory is uploaded to the club drive. if you want to claim something for
field day, comment on the doc.`,
  },
];

export async function createBlogEntries() {
  console.log(`⏳ Seeding blog entries...`);

  let createdCounter = 0;
  const existingCount = await prisma.blogs.count();

  const author = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });
  if (!author) {
    console.log('❌ Admin user not found, skipping blog seeding');
    return;
  }

  // Spread authorship across the named members so the byline isn't
  // monochrome on the redesign.
  const namedAuthors = await prisma.user.findMany({
    where: { isPubliclyVisible: true, callsign: { not: null } },
    select: { id: true },
  });
  const authorPool = namedAuthors.length > 0 ? namedAuthors : [author];

  // Stagger createdAt over the past ~90 days so the date column on the
  // blog list looks lived-in instead of "all on the same day."
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (const [i, post] of POSTS.entries()) {
    const existing = await prisma.blogs.findFirst({
      where: { title: post.title },
    });
    if (existing) continue;

    const a = authorPool[i % authorPool.length];
    const daysBack = 4 + i * 7 + Math.floor(Math.random() * 4);
    const createdAt = new Date(now - daysBack * dayMs);

    await prisma.blogs.create({
      data: {
        title: post.title,
        content: post.content,
        tags: post.tags,
        authorId: a.id,
        createdAt,
        updatedAt: createdAt,
      },
    });
    createdCounter += 1;
  }

  console.log(
    `✅ ${existingCount} existing blog entries 👉 ${createdCounter} blog entries created`
  );
}
