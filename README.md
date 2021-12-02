# crosswordstatswebsite
Instructions on how to get your New York Times authorization token

- Go to https://www.nytimes.com/crosswords
- Open developer tools
- Go to the Network tab
- Referesh the page
- Look for the requests starting with any of these: "progress.json?", "mini-stats.json?", "stats-and-streaks.json?"
- Click on that request, it'll open another pane
- Click on the Headers tab in that pane
- Scroll down to the "Request Headers" section
- Right click on the "nyt-s" field and select "Copy value"
- Paste this into the text field on the crosswordstats website or save it somewhere else