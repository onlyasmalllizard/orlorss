# OrloRssFeed

## Usage

When you first clone the repo, run `npm install`. To start a development server, run `npm start`.

Some RSS urls that I used to test the site are
- https://www.theguardian.com/uk/rss
- https://www.adweek.com/feed/
- https://feeds.bbci.co.uk/news/technology/rss.xml

## Resources

### Styles

I created the initial style template I used whilst taking Kevin Powell's [Beyond CSS](https://www.beyondcss.dev/) course. I used box shadow #36 from the website [CSS Scan](https://getcssscan.com/css-box-shadow-examples). I found the `.visually-hidden` class on [CSS Tricks](https://css-tricks.com/inclusively-hidden/).

You'll notice that in my class declarations, I separate class names into groups using a `|` symbol. This is [an idea](https://cube.fyi/grouping.html#grouping-order) from [Cube Css](https://cube.fyi/), which has greatly influenced the way I think about CSS in general.

### Masonry layout
For the masonry layout, I used a blog post from [@andybarefoot](https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb) and lived to regret it. I thought that using a grid basis for the layout would make content ordering easier if I was to combine articles by date. With a grid, the articles would automatically flow in order from left to right, as opposed to being in order down one column, then the next, and so on.

In practice, the layout was very hard to control. You'll see that the gaps aren't even between all of the rows. It was also tricky to get the resizing to happen at the correct time, as the cards aren't guaranteed to exist until `afterViewInit`. If I was building a real project or had more time, I would have started again with a different approach.

### General Code
The `ConfigService`, `SubscriptionUtilsComponent` and the `WINDOW` provider are approaches we use at my current job. I found the RegEx to strip HTML tags from a string on this [StackOverflow question](https://stackoverflow.com/questions/5002111/how-to-strip-html-tags-from-string-in-javascript).

## Comments about the ticket
### Card title font
Is the font used for the card headings also Lato? I tried it with both Lato Thin and Lato, but neither look quite right next to the design.

### Colour contrast
The blue in the design doesn't have enough contrast against either white text or a grey background. If this was a ticket I received at work, I would raise this as an issue with the designer.


