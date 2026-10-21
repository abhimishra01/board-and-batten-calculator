// Pre-set pages. Each one opens the calculator with its own numbers and adds text and tables
// that only fit that case. Tables are computed in src/pages/[slug].astro from layout.mjs.
export type LayoutPage = {
  slug: string;
  kind: 'wall' | 'batten' | 'ends' | 'boards' | 'gap' | 'rails' | 'accent' | 'bathroom';
  short: string;          // link text on the home page and in the list of other layouts
  blurb: string;          // one line under the link on the home page
  h1: string;
  metaTitle: string;
  description: string;
  note: string;           // line above the results until the visitor types
  ft?: number;            // wall width in feet (kind wall)
  batten?: number;        // batten width in inches (kind batten)
  intro: string[];
  sections: { h: string; p: string[] }[];
  faq: { q: string; a: string }[];
};

export const layouts: LayoutPage[] = [
  {
    slug: 'board-and-batten-spacing-8-ft-wall',
    kind: 'wall',
    ft: 8,
    short: '8 ft wall',
    blurb: 'Bathrooms, powder rooms and narrow hallways.',
    h1: 'Board and batten spacing for an 8 ft wall',
    metaTitle: 'Board and Batten Spacing for an 8 Ft Wall',
    description: 'Exact board and batten spacing for an 8 foot wide wall with 1x3 battens. See the gap for each batten count, the marks from the left and the boards to buy.',
    note: 'Set to an 8 ft wide wall. Type your own numbers.',
    intro: [
      'An 8 foot wall is 96 inches wide. It is a common size for a powder room, a bathroom wall, a short hallway or the wall behind a twin bed.',
      'On a small wall the gaps are easy to see, so a small error stands out. The table below shows every sensible batten count for 1x3 battens, so you can pick one and read the gap.',
    ],
    sections: [
      { h: 'What looks right on a narrow wall', p: [
        'On a short wall, fewer battens with wider gaps look calm. Many people stay between 8 and 12 inches here. A gap above 16 inches leaves large empty panels, and a gap below 6 inches makes a small room feel crowded.',
        'If the wall has a door or a window near one end, check where the first and last battens land before you buy wood. A batten that touches a door casing looks like a mistake.',
      ] },
      { h: 'Small walls need exact marks', p: [
        'Over 96 inches, an error of 1/8 inch in each gap adds up to about 1 inch by the last batten. Mark every center from the same end of the wall with one tape measure. Do not move the tape from batten to batten.',
      ] },
    ],
    faq: [
      { q: 'How many battens fit on an 8 ft wall?', a: 'With 1x3 battens and a batten at each end, 6 to 9 battens give gaps from 9 to 16 inches. Most people choose 7 or 8.' },
      { q: 'Should an 8 ft wall have a batten at each end?', a: 'Yes, if the wall meets another wall. The end batten hides the corner joint. Turn the option off if you want a gap at each end.' },
    ],
  },
  {
    slug: 'board-and-batten-spacing-10-ft-wall',
    kind: 'wall',
    ft: 10,
    short: '10 ft wall',
    blurb: 'Bedroom walls and small living rooms.',
    h1: 'Board and batten spacing for a 10 ft wall',
    metaTitle: 'Board and Batten Spacing for a 10 Ft Wall',
    description: 'Board and batten spacing for a 10 foot wall (120 inches). Gap for each batten count with 1x3 battens, marks from the left and the boards to buy.',
    note: 'Set to a 10 ft wide wall. Type your own numbers.',
    intro: [
      'A 10 foot wall is 120 inches wide. This is a usual width for a bedroom wall behind the bed, or one wall of a small living room.',
      'A bed is the usual center of the room, so people often care about one more thing: a gap or a batten that lines up with the middle of the bed or a headboard. The calculator can center a gap on a point you choose. Turn on the option "Center on a window, TV or mirror" and type the distance from the left edge.',
    ],
    sections: [
      { h: 'Counts that work on 10 ft', p: [
        'The table lists the batten counts that give gaps from about 8 to 18 inches. The odd and even counts differ in one useful way. With a batten at each end, an odd count puts a batten at the exact center of the wall, and an even count puts a gap there. Pick the one that matches the thing in the middle of the room.',
      ] },
      { h: 'Check the first marks', p: [
        'The marks column shows where the first batten center sits. Use it to see if the first gap clears a door, an outlet or a light switch. Move the count up or down by one if it does not.',
      ] },
    ],
    faq: [
      { q: 'How many battens do I need on a 10 ft wall?', a: 'For gaps near 12 inches with 1x3 battens, use 9 battens. For gaps near 17 inches, use 7. The table on this page shows the gap for each count.' },
      { q: 'How do I put a batten in the center of a 10 ft wall?', a: 'Use an odd number of battens with a batten at each end. The middle batten then sits at 60 inches from the left edge.' },
    ],
  },
  {
    slug: 'board-and-batten-spacing-12-ft-wall',
    kind: 'wall',
    ft: 12,
    short: '12 ft wall',
    blurb: 'Living rooms, dining rooms and entryways.',
    h1: 'Board and batten spacing for a 12 ft wall',
    metaTitle: 'Board and Batten Spacing for a 12 Ft Wall',
    description: 'Board and batten spacing for a 12 foot wall (144 inches). Gap for every batten count with 1x3 battens, center marks and boards to buy.',
    note: 'Set to a 12 ft wide wall. Type your own numbers.',
    intro: [
      'A 12 foot wall is 144 inches wide. It is the most common size for a living room feature wall, a dining room or an entryway.',
      'Many walls this wide have a window, a fireplace or a TV on them. If yours does, read the section on centering below before you pick a count.',
    ],
    sections: [
      { h: 'A worked example', p: [
        'Ten 1x3 battens, one at each end, take 25 inches. The other 119 inches split into 9 equal gaps of 13 1/4 inches. The center of the first batten is 1 1/4 inches from the left edge, and each later center is 15 3/4 inches farther along.',
      ] },
      { h: 'Working around a window or a TV', p: [
        'Equal gaps across the whole wall will not land a batten on every window edge. The usual fix is to center one gap on the window. Turn on "Center on a window, TV or mirror" in the calculator, type the distance from the left edge to the middle of the window, and choose "A gap". The tool keeps your gap and slides the whole run, so the end spaces become unequal. Keep both end spaces wider than half a batten, or the end looks cramped.',
      ] },
      { h: 'Rails on a 12 ft wall', p: [
        'A 12 foot wall takes a rail from one 12 foot board with no joint. If you add a top rail, the tool counts it in the cut list and the boards to buy.',
      ] },
    ],
    faq: [
      { q: 'What is the best batten spacing for a 12 ft wall?', a: 'Gaps of 12 to 16 inches suit most 12 foot walls. With 1x3 battens that is 9 to 11 battens. Ten battens give the 13 1/4 inch gaps in the worked example.' },
      { q: 'Can I center the layout on a window?', a: 'Yes. Turn on the centering option, type the distance from the left edge to the middle of the window, and pick whether a gap or a batten sits there.' },
    ],
  },
  {
    slug: 'board-and-batten-spacing-16-ft-wall',
    kind: 'wall',
    ft: 16,
    short: '16 ft wall',
    blurb: 'Long hallways, great rooms and open plans.',
    h1: 'Board and batten spacing for a 16 ft wall',
    metaTitle: 'Board and Batten Spacing for a 16 Ft Wall',
    description: 'Board and batten spacing for a 16 foot wall (192 inches). Gap for every batten count, marks from the left and how to handle rails longer than a board.',
    note: 'Set to a 16 ft wide wall. Type your own numbers.',
    intro: [
      'A 16 foot wall is 192 inches wide. This is a long hallway, a great room wall or the long wall of a mudroom.',
      'Two things change on a wall this long. You need more battens, so the cut list grows. And horizontal rails are longer than the longest common board, so they need a joint.',
    ],
    sections: [
      { h: 'Rails longer than a board', p: [
        'The longest common board is 12 feet. A 16 foot rail needs two pieces. The calculator splices a rail into full-length boards and one short piece, and it counts those pieces in the boards to buy. Plan the joint so it falls on a batten, where it is hidden and has wood behind it. A joint in the open between battens is easy to see.',
      ] },
      { h: 'Mark in two runs', p: [
        'A 16 foot tape measure is hard to hold straight. Mark the first half from the left end, then measure the second half from the right end. Use the mark list for both. If the two runs do not meet at the same spot, you have a tape error. Find it before you cut.',
      ] },
      { h: 'Keep the pace of the wall', p: [
        'On a long wall, gaps of 14 to 18 inches keep the wall from looking busy. A count that is a little low looks better than one that is a little high.',
      ] },
    ],
    faq: [
      { q: 'How many battens do I need on a 16 ft wall?', a: 'For gaps near 15 inches with 1x3 battens, use 12 battens. For gaps near 19 inches, use 10. The table on this page lists each count.' },
      { q: 'How do I join a rail on a 16 ft wall?', a: 'Cut the joint so it lands behind a batten, and glue and nail both ends to studs. The calculator shows how many pieces and boards the rails need.' },
    ],
  },
  {
    slug: 'board-and-batten-spacing-1x4-battens',
    kind: 'batten',
    batten: 3.5,
    short: '1x4 battens',
    blurb: 'A bolder look. Gaps for 3 1/2 inch battens.',
    h1: 'Board and batten spacing with 1x4 battens',
    metaTitle: 'Board and Batten Spacing With 1x4 Battens',
    description: 'Spacing for board and batten with 1x4 battens (3 1/2 inches wide). Gap and count for common wall widths, plus center to center distances.',
    note: 'Set to 1x4 battens. Type your own numbers.',
    intro: [
      'A 1x4 board is 3 1/2 inches wide, not 4. The 1 inch is the thickness before drying, and the real thickness is 3/4 inch. Enter 3 1/2 for the width, as this page does.',
      'Wider battens give a bolder look and cover more of the wall. For the same gap, you need fewer of them than 1x3 battens.',
    ],
    sections: [
      { h: 'Why gaps change with a wider batten', p: [
        'Each batten takes 1 inch more than a 1x3. Across a 12 foot wall, ten battens take 35 inches instead of 25. The gap shrinks from 13 1/4 to 12 1/9 inches. So if you swap 1x3 for 1x4 and keep the count, the gaps get narrower. If you want to keep the gap, drop one batten.',
      ] },
      { h: 'Center to center for 1x4 battens', p: [
        'The center to center distance is the gap plus 3 1/2 inches. The second table shows it for common gaps. Use it if you mark a level line and step along it with a story stick.',
      ] },
    ],
    faq: [
      { q: 'What is the real width of a 1x4?', a: 'A 1x4 is 3 1/2 inches wide and 3/4 inch thick. Measure your boards, because some mills differ a little.' },
      { q: 'Are 1x4 battens too wide for board and batten?', a: 'No. Many people use them on tall walls or in large rooms. On a small wall, 1x3 or 1x2 battens look lighter.' },
    ],
  },
  {
    slug: 'board-and-batten-spacing-1x2-battens',
    kind: 'batten',
    batten: 1.5,
    short: '1x2 battens',
    blurb: 'A light, fine look. Gaps for 1 1/2 inch battens.',
    h1: 'Board and batten spacing with 1x2 battens',
    metaTitle: 'Board and Batten Spacing With 1x2 Battens',
    description: 'Spacing for board and batten with 1x2 battens (1 1/2 inches wide). Gap and count for common wall widths and center to center distances.',
    note: 'Set to 1x2 battens. Type your own numbers.',
    intro: [
      'A 1x2 board is 1 1/2 inches wide. It makes a fine, light line. It suits a nursery, a small bathroom or a wall where you want texture without weight.',
      'Thin battens need a tighter gap to read as a pattern. A 12 inch gap between 1 1/2 inch battens can look sparse, so many people go down to 6 to 10 inches.',
    ],
    sections: [
      { h: 'More battens, more cuts', p: [
        'Narrow gaps mean more pieces. A 12 foot wall at an 8 inch gap needs about 16 battens. Each one needs a cut, a nail line and a bead of adhesive. Plan the time, and cut all battens from the same stack so the lengths match.',
      ] },
      { h: 'Watch for bowing', p: [
        '1x2 boards bow more than wider boards. Sight along each one at the store and pick the straight ones. Use construction adhesive along the whole length, and nail into studs where you can.',
      ] },
    ],
    faq: [
      { q: 'How far apart should 1x2 battens be?', a: 'Most people use gaps of 6 to 10 inches with 1x2 battens. Wider gaps leave the wall looking empty.' },
      { q: 'How wide is a 1x2?', a: 'A 1x2 is 1 1/2 inches wide and 3/4 inch thick.' },
    ],
  },
  {
    slug: 'board-and-batten-without-end-battens',
    kind: 'ends',
    short: 'No end battens',
    blurb: 'A gap at each end instead of a batten.',
    h1: 'Board and batten spacing with no end battens',
    metaTitle: 'Board and Batten Spacing With No End Battens',
    description: 'How to space board and batten with a gap at each end of the wall. Compare the gap with and without end battens for common wall widths.',
    note: 'End battens are off. Type your own numbers.',
    intro: [
      'Some walls look better with a gap at each end instead of a batten. The wall then looks as if it floats, and the first and last panels match the rest.',
      'The math changes by one. With no end battens, there is one more gap than there are battens, so each gap is a little smaller than it would be with end battens.',
    ],
    sections: [
      { h: 'The formula', p: [
        'gap = (wall width - battens x batten width) / (battens + 1). The same gap sits at each end of the wall and between every pair of battens.',
      ] },
      { h: 'When to skip the end batten', p: [
        'Skip it when the wall ends at a door casing, a window or a built-in that already makes a clean edge. Skip it on a wall with a corner that is not square, because a gap hides the error better than a batten does. Keep it when the wall meets another wall that also gets battens, because the end batten then forms the corner.',
      ] },
    ],
    faq: [
      { q: 'Do I need a batten at each end of a board and batten wall?', a: 'No. It is a style choice. An end batten hides the corner joint. A gap at each end gives a floating look.' },
      { q: 'What is the end gap with no end battens?', a: 'It equals every other gap. The calculator makes all gaps the same, including the two at the ends.' },
    ],
  },
  {
    slug: 'how-many-boards-for-board-and-batten',
    kind: 'boards',
    short: 'How many boards',
    blurb: 'Boards to buy by wall width and ceiling height.',
    h1: 'How many boards do you need for board and batten?',
    metaTitle: 'How Many Boards for Board and Batten (Calculator)',
    description: 'How many 8, 10 and 12 foot boards to buy for a board and batten wall. Counts by wall width and ceiling height, with saw cuts and waste included.',
    note: 'Set to a 12 ft wall. Type your own numbers.',
    intro: [
      'The number of boards depends on the battens, the ceiling height and the length of board you buy. Battens run floor to ceiling, so each one is as long as the wall is high.',
      'The tables below use 1x3 battens with gaps near 12 inches. The calculator above works for any size. It adds 1/8 inch for each saw cut.',
    ],
    sections: [
      { h: 'Match the board to the ceiling', p: [
        'With an 8 foot ceiling, 8 foot boards fit with no waste, but only if your battens are 96 inches or less. If the wall is 97 inches high, an 8 foot board is too short and you need 10 foot boards. The second table shows what happens at 9 and 10 foot ceilings.',
      ] },
      { h: 'Use the offcuts', p: [
        'A 10 foot board cut for a 9 foot batten leaves a 1 foot piece. That is enough for short trim, a sill cap or test cuts. The waste column shows how much wood goes to offcuts. Waste is not always lost money if you have a use for the pieces.',
      ] },
      { h: 'Buy one extra', p: [
        'A bowed board or a bad cut costs one board. Add one to the count so you do not make a second trip.',
      ] },
    ],
    faq: [
      { q: 'How many 1x3 boards for a 12 ft wall?', a: 'At a gap near 12 inches, a 12 foot wall takes about 11 battens. On an 8 foot ceiling that is 11 boards of 8 feet. The first table shows the count by length.' },
      { q: 'Do rails add many boards?', a: 'A rail runs the full width of the wall, so two rails on a 12 foot wall use two 12 foot boards. Turn on rails in the calculator to see the total.' },
    ],
  },
  {
    slug: 'how-far-apart-board-and-batten',
    kind: 'gap',
    short: 'How far apart',
    blurb: 'Pick a gap and see how many battens it needs.',
    h1: 'How far apart should board and batten be?',
    metaTitle: 'How Far Apart Should Board and Batten Be?',
    description: 'How far apart to space board and batten: gaps from 8 to 16 inches compared on a 12 foot wall, with the batten count and center to center distance for each.',
    note: 'Set to a 12 inch gap on a 12 ft wall. Type your own numbers.',
    intro: [
      'Most board and batten walls use gaps between 8 and 16 inches. There is no single right answer. The best gap depends on the room size, the ceiling height and how bold you want the wall to look.',
      'This page starts in "gap I want" mode. Type the gap you like and the tool picks the batten count that comes closest, then makes every gap equal. If it has to move your gap, the result says by how much.',
    ],
    sections: [
      { h: 'Rules of thumb', p: [
        'Tall ceilings take wider gaps. Small rooms take narrower gaps. Wide battens look right with wider gaps, and thin battens look right with narrow ones. Formal rooms such as a dining room or an entry hold up well with 8 to 10 inches. Living rooms and bedrooms often use 12 to 16.',
      ] },
      { h: 'Test it on the wall', p: [
        'Cut a few offcuts to the batten width and lay them on the wall with painter tape. Step back to the middle of the room. If the pattern looks too busy, widen the gap. If the wall looks empty, narrow it. Ten minutes of testing beats an hour of redoing nailed battens.',
      ] },
    ],
    faq: [
      { q: 'Is 12 inches a good gap for board and batten?', a: 'Yes. It is the most common starting point. It reads as balanced in most rooms.' },
      { q: 'Does the gap change if I use wider battens?', a: 'The gap you choose stays the same, but the count drops, because each wider batten takes more of the wall.' },
    ],
  },
  {
    slug: 'board-and-batten-calculator-with-rails',
    kind: 'rails',
    short: 'With rails',
    blurb: 'Top and bottom rails, with marks from the floor.',
    h1: 'Board and batten calculator with horizontal rails',
    metaTitle: 'Board and Batten Calculator With Horizontal Rails',
    description: 'Board and batten spacing with horizontal rails. Get the batten gaps, the rail marks from the floor and the cut list with rails included.',
    note: 'Set to a 12 ft by 8 ft wall with 2 rails. Type your own numbers.',
    intro: [
      'Many board and batten designs add one or more horizontal rails. A rail across the top and a rail at the bottom frame the battens. A mid rail gives a two-tier look.',
      'In this tool the first rail sits on the floor and the last rail sits at the ceiling. Extra rails are spaced evenly between them. One rail sits in the middle of the wall. If you want a chair-rail height or a picture-ledge height instead, use the batten marks and place that rail by hand.',
    ],
    sections: [
      { h: 'Order of work', p: [
        'Fix the rails first, then fit the battens between or over them. Mark the rail heights on the wall from the floor. Use a laser or a long level to keep each rail level across the wall. The floor is rarely flat, so measure from the same reference line at both ends.',
      ] },
      { h: 'Rails are long boards', p: [
        'A rail runs the full width of the wall. On a wall wider than your longest board, the calculator splices the rail and counts the pieces. Put the joint behind a batten.',
      ] },
    ],
    faq: [
      { q: 'How wide should a board and batten rail be?', a: 'Many people use the same width as the battens, or one size up. A 1x4 rail with 1x3 battens is a common choice.' },
      { q: 'How do I find rail heights?', a: 'Enter the wall height, the number of rails and the rail width. The tool lists the center and bottom edge of each rail, measured up from the floor.' },
    ],
  },
  {
    slug: 'board-and-batten-accent-wall',
    kind: 'accent',
    short: 'Accent wall',
    blurb: 'One feature wall: gaps, marks and boards for common widths.',
    h1: 'Board and batten accent wall calculator',
    metaTitle: 'Board and Batten Accent Wall Calculator (Free)',
    description: 'Plan a board and batten accent wall. See the batten count and gap for common widths, the marks to draw and the boards to buy. Free, in inches or cm.',
    note: 'Set to a 12 ft wide accent wall, 8 ft high. Type your own numbers.',
    intro: [
      'A board and batten accent wall covers one wall of the room, often the one behind a bed, a sofa or a dining table. Because only one wall gets the pattern, the gaps are what everyone sees first. They must be equal.',
      'Enter the width and height of your wall. The tool gives the exact gap, a mark for the center of every batten and the boards to buy. Switch to metric if you work in centimeters.',
    ],
    sections: [
      { h: 'Pick the count, then check the look', p: [
        'On an accent wall, most people choose gaps of 10 to 14 inches. Wide gaps look calm. Narrow gaps look busy and formal. Use the tables above to find a count near the gap you like, then compare the drawings in the tool.',
      ] },
      { h: 'Plan around what is on the wall', p: [
        'A bed, a TV or a shelf will cover some of the wall. Decide where the furniture goes first. Then check that no batten lands on the edge of a window, a switch plate or a vent. Moving the count by one often fixes it.',
      ] },
      { h: 'Where the pattern stops', p: [
        'On an accent wall the battens end at the corners of that wall. A batten at each end gives a finished edge. If the wall meets another painted wall, paint the battens and the wall the same color or a clear contrast, so the edge looks planned.',
      ] },
    ],
    faq: [
      { q: 'How many battens does an accent wall need?', a: 'It depends on the width and the gap. A 12 foot wall with 1x3 battens and a gap near 12 inches needs 10 battens. Use the table on this page for other widths.' },
      { q: 'Can I use this calculator in centimeters?', a: 'Yes. Switch to Metric at the top of the tool and enter sizes in centimeters.' },
    ],
  },
  {
    slug: 'board-and-batten-bathroom',
    kind: 'bathroom',
    short: 'Bathroom',
    blurb: 'Short walls and half-height wainscot with the boards to buy.',
    h1: 'Board and batten bathroom calculator',
    metaTitle: 'Board and Batten Bathroom Calculator and Spacing',
    description: 'Space board and batten in a bathroom. Batten count and gap for 5 to 8 foot walls, plus the boards to buy for a 4 foot high wainscot. Free, in inches or cm.',
    note: 'Set to a 6 ft wide wall, 4 ft high. Type your own numbers.',
    intro: [
      'Bathroom walls are short. Many are 5 to 8 feet wide, and many people stop the battens halfway up as a wainscot. On a small wall, a gap that is off by a little stands out.',
      'Enter the width of the wall and the height where the battens stop. The tool gives the gap, the marks and the boards to buy. Use inches or centimeters.',
    ],
    sections: [
      { h: 'Use a tight gap on a small wall', p: [
        'In a small room, gaps of 6 to 10 inches usually look in proportion. A gap of 16 inches leaves a large flat panel that looks bare next to a vanity or a tub.',
      ] },
      { h: 'Wainscot height', p: [
        'Enter the height where the battens end as the wall height. The table above uses 48 inches. The tool cuts each batten to that length and works out the boards for you.',
      ] },
      { h: 'Moisture', p: [
        'A bathroom is damp. Use boards made for damp rooms or primed and sealed wood. Caulk the seams and the top edge, and paint with a semi-gloss paint made for bathrooms.',
      ] },
    ],
    faq: [
      { q: 'How high should board and batten go in a bathroom?', a: 'Many people stop at about 4 feet. Others go up to 5 or 6 feet, or all the way to the ceiling. Enter your height in the tool to see the boards you need.' },
      { q: 'Should the battens be 1x2 or 1x3 in a small bathroom?', a: 'Both work. A 1x2 is 1 1/2 inches wide and looks lighter. A 1x3 is 2 1/2 inches wide and looks bolder. Try both in the tool.' },
    ],
  },
];
