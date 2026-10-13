# Learning Outdoors

FIT3179 Data Visualisation 2, Monash University. Henson Zein, October 2026.

A single scrolling page built with Vega-Lite that asks why Australians go into nature as adults and what happens before that. Live page: https://grindinghz.github.io/learning-outdoors/

## Repository layout

```
index.html                 the page
css/style.css              typography and layout
js/config.json             shared Vega-Lite config (fonts, colours, axes, legends)
js/embed.js                embeds every chart with vegaEmbed
js/c01_*.json ... c15      one Vega-Lite spec per chart, pretty printed
data/*.csv                 one aggregated table per chart
data/geo/                  Australian states and world-110m boundaries, both TopoJSON
sketch/                    hand-drawn sketch (PDF)
```

## Domain, why and who

**Domain.** Outdoor participation and outdoor learning in Australia: who spends time in nature, at what age the habit forms, and how much of that experience schools provide.

**Why.** Bush walking is the third most popular physical activity in the country, yet it is almost entirely an adult habit. Children's organised activity happens on sports fields and in halls, and only one in five Australian 15 year olds is taken outside to investigate the environment at school. The page puts the adult habit and the childhood gap side by side so a reader can see that the habit is learned late, and consider whether it could be learned earlier.

**Who.** The average Australian adult: a parent, a teacher, a walker, a voter. No statistics beyond a percentage, no jargon, every term explained in the text before the chart that uses it.

## What: the data

Two sources, both the most recent release available.

1. **AusPlay survey, January to December 2025** (Australian Sports Commission, Clearinghouse for Sport, released 30 April 2026). National and eight state and territory workbooks. Participation rate and estimated participants for 142 activities, adults (15+) and children (0 to 14, organised activity outside school hours only), by gender and age; places where activity happens; reasons for being active. https://www.ausport.gov.au/clearinghouse/research/ausplay/results
2. **PISA 2025 Results (Volume I), Annex B1, Chapter 5, "Students and the environment"** (OECD, released 8 September 2026). Environmental science scores and proficiency for 85 systems, opportunities for environmental learning in class (including field trips), school environmental activities reported by principals, career interest, and the 2006 to 2025 awareness trend. https://www.oecd.org/en/publications/pisa-2025-results-volume-i_73451bc5-en.html and https://stat.link/h3z8b1
3. Boundaries: Australian states from tonywr71/GeoJson-Data, converted to TopoJSON and clipped to Australia (bounding box 111, -45, 153, -11) with mapshaper; world-110m TopoJSON (vega-datasets).

Cleaning was limited to reshaping the publishers' tables into tidy CSVs with Python (pandas) and pre-aggregating one small table per chart, so each Vega-Lite spec only encodes. Rates are shown as published, to one decimal place (two below 1%) in tooltips; map labels use the same precision as their legend classes, so a label never contradicts its colour. State rows where AusPlay reported no respondents were dropped rather than treated as zero. Sub-national PISA systems (Beijing, Shanghai, Jiangsu and Zhejiang in China; 17 regions of Ukraine) are drawn as dots rather than filling their whole country. Malta, Kosovo and the small city systems (Singapore, Hong Kong, Macao) are also drawn as dots because the world-110m boundaries omit them or lack a matching code. The page, styles, chart specifications and data together come to about 400 KB, plus the Vega libraries loaded from a CDN.

## How: idioms and features

Fifteen charts, four of them maps, in eight sections that follow one argument.

| # | Idiom | Why this idiom |
|---|---|---|
| 1 | Isotype grid, three panels (out of 100 people) | The whole argument in one picture: adults who bush walk, children in organised bush walking, students on field trips; the only chart that joins both sources |
| 2 | Choropleth with activity selector, Albers equal-area | Rate by state in five equal-step classes; the selector redraws the map, its key and its title for other nature activities |
| 3 | Proportional symbol map, Albers equal-area | Count of walkers as circle area, semi-transparent with outlines; read against chart 2 because rate and count tell different stories |
| 4 | Small-multiple choropleths, Albers equal-area, diverging classes | Where each activity over- or under-indexes against the national rate, in five classes centred on the national rate |
| 5 | Ranked bar chart, top 25 | Rank is the point: bush walking is 3rd and the next nature activity 19th, on a plain percentage axis with every row named |
| 6 | Heatmap, diverging index | Age profile relative to each activity's own rate, so every row is comparable; activities too small for reliable age estimates are left out |
| 7 | Butterfly chart, linear scale with broken bars | Men versus women on a plain axis; bush walking's bars are cut and labelled so the smaller activities stay readable |
| 8 | Dumbbell on a log scale | Adults versus children per activity; the subtitle flags that the two ends are measured differently |
| 9 | Bump chart | Rank of reasons by age band; one line highlighted |
| 10 | Dumbbell | Where activity happens, adults versus children |
| 11 | World choropleth, Equal Earth | PISA environmental science score in classes that break at the OECD average, Australia outlined |
| 12 | Parallel coordinates | 90 countries across four class statements; Australia and the OECD average highlighted against the grey spread, so Australia's low field-trip share stands out |
| 13 | Slope chart | Fourteen school activities, OECD to Australia, colour by direction |
| 14 | Arrow chart | Three issues, two series, one direction, 2006 to 2025 |
| 15 | Annotated scatter with trend line and brush | Carries the closing argument; the brush lets the reader isolate a group of countries |

Interaction is limited to where it changes what can be learned: the activity selector on the choropleth, hover highlighting on the bump, slope and parallel-coordinates charts, and a brush on the scatter. Every mark has a tooltip with the same field order: name, value with unit, then context.

Custom elements: eight section icons drawn as inline SVG for this page; the person glyph in chart 1 is an SVG path passed as the point shape; the ACT is drawn as an inset circle on the choropleth because it is too small to see; annotation text is placed from small inline datasets so it never overlaps data marks.

Map conventions: equal-area projections throughout (Albers conic for Australia, Equal Earth for the world); choropleths show only rates, ratios or averages, never raw counts, while counts go on the proportional symbol map; every choropleth key lists ordered classes with their ranges; all boundaries are TopoJSON with white borders.

## Munzner's What / Why / How, chart by chart

Datasets: two tables (AusPlay 2025 and PISA 2025) and spatial geometry (Australian states and world countries, TopoJSON). Attribute types are categorical (activity, place, country, reason), ordinal (age band, rank, score class) and quantitative (shares, counts, scores, ratios).

| # | What: data and attribute types | Why: task | How: marks and channels |
|---|---|---|---|
| 1 | Three groups (categorical), share of each (quantitative) | Present and compare three proportions | Point marks (person glyphs) in 10 by 10 grids; count of filled glyphs encodes the share; hue separates filled from empty |
| 2 | State polygons (geometry); rate by state and activity (quantitative ratio) | Locate high and low states; compare regions | Area marks; luminance of one hue in five ordered classes; a selector filters the activity |
| 3 | State centres (geometry); number of walkers (quantitative count) | Locate and compare totals | Point marks at state centres; area (size) encodes the count |
| 4 | State polygons; state rate divided by national rate (quantitative, diverging around 1) for six activities | Discover spatial patterns; identify extremes | Area marks in juxtaposed small multiples; diverging hue and luminance in five classes |
| 5 | 25 activities (categorical); share (quantitative); nature flag (categorical) | Rank activities; locate the nature ones | Line marks (bars); length on a common scale; hue separates nature from other |
| 6 | Activity by age band (ordinal); index against the activity's own rate (quantitative, diverging) | Summarise age profiles; compare shapes; find where participation drops | Area marks in a matrix; diverging luminance; outlines highlight the spans the title describes |
| 7 | Activity by gender (categorical); share (quantitative) | Compare two groups item by item | Bars back to back; length on a shared linear scale; hue for gender; broken bars for the outlier |
| 8 | Activity by cohort (categorical); share spanning four orders of magnitude (quantitative) | Compare pairs; find where children lead | Two point marks joined by a line; horizontal position on a log scale; hue for cohort |
| 9 | Reason by age band (ordinal); rank (ordinal) and share (quantitative) | Discover trends in rank | Line and point marks; vertical position encodes rank, horizontal encodes age; hue and luminance pop out one reason; hover isolates a line |
| 10 | Place by cohort (categorical); share (quantitative) | Compare pairs | Two point marks joined by a line; position on a common scale; hue for cohort |
| 11 | Country polygons; mean score (quantitative) | Locate Australia; summarise the world distribution | Area marks on an Equal Earth projection; luminance classes that break at the OECD average; outline and text annotate Australia |
| 12 | 90 countries by four statements (categorical); share (quantitative) | Compare one item against the whole distribution; identify outliers | Line marks across parallel axes; vertical position; hue and luminance pop Australia and the OECD average out of the grey context; hover identifies a country |
| 13 | 14 activities by two groups; share and gap (quantitative) | Compare two groups; find the largest differences | Line marks (slopes); position and slope; hue for the direction of the gap; stroke width for its size |
| 14 | Three issues by two series by two years; share (quantitative) | Discover the direction and size of change | Arrow marks; position; length encodes the change and arrowhead direction its sign; hue for series |
| 15 | 82 countries; two quantitative attributes | Discover correlation; locate Australia | Point marks; horizontal and vertical position; hue highlights Australia; trend line; a brush selects a group |

## Acknowledgements

Data cleaned with Python (pandas). Text and charts are released under CC BY 4.0; the data remains under its publishers' terms.
