# Crossword Stats Website

## Overview
Welcome to the CrosswordStats Website! As an avid fan of solving the NYT Daily Crossword, I found the statistics exposed to users a bit lacking and thought it would be fun to let other people comb through their own data. For instructions on how to get access to your NYT Crossword data please see the _Users_ section. For developers who want details on how the website is set up and instructions for how to contribute, please see the _Developers_ section.

## Users

### Getting your NYT auth-token

Detailed GIFs demonstrating this process can be found on our [wiki](https://github.com/nicwineburger/crosswordstatswebsite/wiki/Getting-Your-NYT-Auth-Token)

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



### Downloading a CSV of your data
In the plot menu bar there is an button that will download the data you requested into the raw CSV that we parse to make the plots. 

### Uploading a CSV of your own data
CSV's need to be in the right format for plotting. The headers for the file are:

_date, puzzle_id, weekday, solve_time_secs, opened_unix, solved_unix, cheated_

Note that at the current moment we're only using the three fields _date, weekday, solve_time_secs_ so the rest of the columns can be empty. 

## Developers
### Website details
The front end of the website is hosted through GitHub Pages which is based on the `gh-pages` branch. Our workflow so far has been to test locally on a `feature/` branch and merge that into `master` when it's working. The `gh-pages` branch contains minified production code so we *never* merge `master` into `gh-pages`. To deploy the front-end you must run `npm run deploy` which will do the necessary packing of the code and deploy it to `gh-pages`. 

The website is primiarly written using a React framework, though we'd like to migrate to TypeScript at some point in the future.

If you'd like to contribute to the frontend (which you should do!) please create a new `feature/` branch and make a PR. I am not a web developer by training so any expertise relating to React or CSS would be greatly appreciated. 

The backend of the website is based on [this repository](https://github.com/nicwineburger/crossword). Please go there to learn more. 

### Todo's and Future Ideas
- [ ] Automatically resize elements so the site isn't broken on mobile
- [ ] Automatically getting a users' NYT auth-token (probably impossible)
- [ ] More statistics (rolling average, violin plots, etc)
- [ ] Migrating to TypeScript
- [ ] More CSS and styling
- [ ] Plotting multiple users based on their NYT Leaderboard
- And much more!
