# Mock-customer test: board and batten calculator

Tester: Shuri. Built into my own folder, served on port 4437, driven with playwright-cli at 390x844 and 412x915 (phones), 820x1180 (tablet), 1280 and 1366 (desktop). Every persona typed real numbers and read the result. I checked the math by hand for Dave and Tom. It is right (gap, on-center, every mark to 1/16", board counts).

## The five people

### 1. Dave, 52, retired contractor, laptop (1366 wide)
Task: 11 ft 7 1/2 in wall, 8 ft high, 1x3 battens, "about 12 inch gaps".
He picked "The gap I want", typed 12, and got 10 battens at 12 3/4 in. Under 30 seconds. He checked the math with a pencil and it matched: (139.5 - 25) / 9 = 12.72.
- Click it on Google? "Yes if the title says calculator and cut list. I would pick it over a page that is only a formula."
- Confused: "I asked for 12 and got 12 3/4. The small note says it picks the closest count, but I want to see the 11-batten option too (11 1/5 in) and pick myself."
- Missing to bookmark: side-by-side options for the nearest counts. A "measure from the right wall" check list.
- Trust: high. The exact decimal (12.722) under the fraction and the formula in the article won him over.
- Come back: yes, for the next wall.

### 2. Jenna, 34, first-time DIYer, iPhone (390 wide)
Task: 10 ft accent wall, 8 ft high, 1x3 battens. She only changed the width and tapped the 1x3 chip.
She got "10 9/16" gap, 10 battens" fast, but on the phone the result sits about 1,060 px down, below the whole form. She changed a number and saw nothing move, then scrolled down to find it.
- Click it on Google? "Yes. 'Free, no sign-up' helped."
- Under 30 seconds? Yes to type, but 10 more seconds to find the answer.
- Confused: "What is 'center to center'? What is the little 1/2 box next to inches? Do I buy wide boards too, or only battens?" The tool says nothing about the wide boards or panels behind the battens.
- Missing: the answer visible while she types. A plain "what do I do now" line.
- Trust: medium. She liked the drawing. The label text in the drawing ("8'", "10'") is very small on her phone.
- Come back: yes, she would text the link to her husband.

### 3. Marcus, 28, nursery wall, Android phone (412 wide)
Task: 9 ft 3 1/2 in wall, 1x4 battens, about 10 in gaps, no end battens, one chair rail.
He typed "3 1/2" in the inch box and it worked. He turned off the end battens, turned on rails, set 1. Result: 8 battens at 9 1/4 in gap, rail at 4 ft, 9 boards of 10 ft.
- Click on Google? Yes.
- Confused: "I did not know the gap at each wall end is the same as the other gaps when I turn off end battens. The drawing shows it, but nothing says it." Also "my chair rail should be at 36 in, not in the middle." Rails can only be spaced evenly from floor to ceiling.
- Also: his battens should stop at the rail (a half wall), but batten length is always the full wall height.
- Missing: set rail height, set batten height.
- Trust: medium. 19% waste for 10 ft boards made him ask "what do I do with the 2 ft offcuts?"
- Come back: yes, if rails can be placed.

### 4. Tom, 45, finish carpenter, desktop (1280 wide)
Task: 15 ft 2 3/16 in wall, 9 ft high, 1x2 battens (1 1/2 in), 12 battens, then one more.
Every mark matched his hand math (first center 3/4 in, last 15 ft 1 7/16 in). The +/- buttons made the "what if 13" check quick. The copy button works and gives centers, rails, cut list and boards.
- Click on Google? Yes.
- Under 30 seconds? Yes, about 20.
- Confused: nothing. But: "I think in on-center spacing. I want to type '16 in OC' and see the count, not a gap."
- Missing: on-center input. Marks measured from the right wall too, so he can check. The copied text has centers only, no left edges. A way to center the pattern on a window or a focal point.
- Trust: high.
- Come back: yes, would bookmark.

### 5. Rosa, 44, home flipper, iPad (820 wide, one column)
Task: 12 ft wall, 8 ft high, 10 battens, two rails, print for her helper.
It works, and the table of boards (8, 10, 12 ft) is what she needed. With two rails the tool puts one at the floor and one at the ceiling (centers at 1 3/4 in and 7 ft 10 1/4 in). She wanted a top rail near 60 in and a bottom rail above the baseboard.
- Click on Google? Yes, "better than the ones with just a formula".
- Confused: the default rail width of 3 in is not a real board size (a 1x4 is 3 1/2 in). The note says rails run the full width, but not whether battens go over or between them.
- Missing: rail positions. A print layout she can tape on the wall. (I could not check the printed page in a headless browser.)
- Trust: high. The layout also survives a reload, so she can bookmark her wall. The link holds her numbers.
- Come back: yes.

## Bugs found while testing
- Typing `12'6` in the feet box is read as 12 ft with no warning. The 6 in is dropped, so the whole layout is 6 in short. No error shows. (Dave, Rosa and Jenna all type this way.)
- Clear the wall width and the message says "Those battens are wider than the wall. The most that fit side by side is 0." The old results stay on screen under it, so a stale answer looks valid. Same with a count of 0: the error shows, the old numbers stay.
- Phone: the result is below the form (about 1,060 px down). Nothing shows the result while you type.

## Ranked change list
Count = how many of the 5 personas asked for it.

### Must
1. Phone: show the live result (gap and count) next to the inputs, for example a sticky summary bar, or a "See result" jump. (3 of 5: Jenna, Marcus, Rosa all hunted for it.)
2. Rail and batten height control. Let the user set where each rail sits (for example 36 in and 60 in from the floor) and let battens stop at a height (half wall). Today rails are even from floor to ceiling and battens always run the full wall. (3 of 5: Marcus, Rosa, Dave via the same wall type.)
3. Fix input handling: `12'6"` or `12-6` in any box should parse or show a plain error, never drop digits silently. Empty width should say "Enter the wall width". Clear old results when an error shows. (3 of 5 typed shortcuts; all 5 are at risk.)

### Should
4. Show the neighbour options when you pick by gap: for example "9 battens: 15 1/16 in, 10: 12 3/4 in, 11: 11 1/5 in" with a click to choose. (2 of 5: Dave, Tom.)
5. On-center input (type "16 in OC", get the count and the real on-center). (2 of 5: Tom, Dave.)
6. Short plain help under the results: what "center to center" means, that the gap at the wall ends equals the other gaps when end battens are off, and that this counts battens (and rails) only, not the wide boards or panels behind. (3 of 5: Jenna, Marcus, Rosa.)
7. Use real board sizes by default (rail 3 1/2 in for a 1x4) and say what to do with the offcuts from 10 and 12 ft boards (the 2 ft pieces). (2 of 5.)
8. Bigger text in the drawing on phones (height, width, gap labels). (2 of 5: Jenna, Marcus.)

### Nice
9. Marks from the right wall too, and left edges in the copied text. (1 of 5: Tom.)
10. A "center the pattern on a window or door" helper. (1 of 5: Tom.)
11. A print page check and a "tape to the wall" scale print. (1 of 5: Rosa.)
12. A save-as-PDF button or a share link button (the URL already holds the numbers, so only the button is missing). (1 of 5.)

## Top 5 changes
1. Phone: keep the live result (gap, count) in view while the user types.
2. Let the user set rail positions and batten height (half wall, chair rail at 36 in).
3. Fix silent parse errors (`12'6` becomes 12 ft) and clear stale results when an error shows.
4. Show the nearest batten counts side by side when the user picks by gap, plus an on-center input.
5. Add plain help under the results: center to center, end gaps when end battens are off, battens only (not the wide boards), and offcut use. Use real board sizes by default.
