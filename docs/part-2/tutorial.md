---
title: Make your static site searchable with Jekyll-Algolia
published: true
description: In this tutorial, we see how to integrate a search engine to the album collection we developed in [my previous tutorial](https://dev.to/adrienjoly/how-to-maintain-a-collection-of-music-albums-online-using-jekyll-and-github-pages-3hd6).
tags: ghpages, jekyll, search, algolia
---

About two weeks ago, I published a tutorial called "[How to maintain a collection of music albums online, using Jekyll and Github Pages](https://dev.to/adrienjoly/how-to-maintain-a-collection-of-music-albums-online-using-jekyll-and-github-pages-3hd6)".

By the end of that tutorial, we were able to generate a 100% static, 100% freely-hosted and well-looking website out of a YAML list of albums, thanks to a Jekyll template. It looked like this:

![screenshot of album collection made with Jekyll and github pages](https://thepracticaldev.s3.amazonaws.com/i/gdh6mg1af0nyx3o3p809.png)

We saw that maintaining that collection of albums was quite easy and convenient: we just have to edit the `_data/albums.yaml`, which is in an almost plain-text format.

You can find the source code what we produced in that github repository: [github.com/adrienjoly/jekyll-tutorial](https://github.com/adrienjoly/jekyll-tutorial).

Now that we're able to edit a list and render it in HTML, let's make our collection of albums **searchable**!

> Note: Written for experienced developers and beginners alike, this tutorial also covers the parts that unexpectedly went wrong. My intention is to also share my problem-solving process, so that beginners can learn how to solve their own problems, down the road. Thanks for your understanding! 🤓

# Proposed solution

After joining Algolia, I discovered that one of my colleagues had released a plug-in to make Jekyll sites searchable: [Jekyll-Algolia](https://github.com/algolia/jekyll-algolia). (License: MIT)

So, yeah, I'm definitely biased on this one, but I'm gonna go ahead and try it!

# Step 1. Integrate the plug-in

Ok, let's start with the prerequisites mentioned in the README file: "*the plugin requires at least Jekyll 3.6.0 and Ruby 2.3.0*".

```bash
$ jekyll -v
jekyll 3.6.2

$ ruby -v
ruby 2.1.4p265 (2014-10-27 revision 48166) [x86_64-darwin14.0]
# ❌ Oops... Let's upgrade ruby!

$ curl -sSL https://get.rvm.io | bash -s stable

# ⚡️ Let's restart the terminal, as suggested by https://stackoverflow.com/a/38194139/592254

$ rvm install 2.3
# (Ended up compiling from its source code, maybe because I'm still on El Capitan?)

$ ruby -v
ruby 2.3.7p456 (2018-03-28 revision 63024) [x86_64-darwin15]
# ✅ We're good to go!

$ rvm use 2.3 --default
```

Now, let's install the plug-in into our codebase: "*add the `jekyll-algolia` gem to your `Gemfile`, in the `:jekyll_plugins` section*"

✋ Blocker: I don't have a `Gemfile` yet!

So, let's follow the corresponding steps suggested by GitHub's tutorial: [Setting up your GitHub Pages site locally with Jekyll](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/#step-2-install-jekyll-using-bundler), first.

I end up with a `Gemfile` at the root directory of my project, with the following contents:

```Gemfile
# Gemfile

source 'https://rubygems.org'
gem 'github-pages', group: :jekyll_plugins

group :jekyll_plugins do
  gem 'jekyll-algolia', '~> 1.0'
end
```

Back to Jekyll-Algolia's instructions: "*download all dependencies with `bundle install`*".

```bash
$ bundle install
```

# Step 2. Set up the search index

Let's follow the [Basic Configuration](https://github.com/algolia/jekyll-algolia#basic-configuration) section of the instructions.

I already have an account on algolia.com, so I'm gonna use that one. You may need to create one for yourself.

Our next step is to create an "[application](https://www.algolia.com/manage/applications)", there. As our codebase will remain open source, we can safely pick the "Community" plan, free of charge.

![screenshot of creating a community algolia application](https://thepracticaldev.s3.amazonaws.com/i/iclpsnb2itdwkgx0x4z4.png)

I'm calling my application "album-shelf", because that's the name of the website on which I want to add search.

After picking a region (`EU WEST`, in my case), let's head to the "API Keys" tab. Copy and paste your *Application ID* to the a new `_config.yml` at the root of your project, like this:

```yaml
# _config.yml

algolia:
  application_id: 'paste_your_application_id_here'
```

Also copy the *Admin API Key*, necessary to [run](https://github.com/algolia/jekyll-algolia#run-it) the plug-in, like this:

```bash
$ ALGOLIA_API_KEY='paste_your_admin_api_key_here' bundle exec jekyll algolia
[✗ Error] No index name defined
```

> Note: your Admin API Key can be used to read, update and delete your Algolia application => make sure you keep it for yourself only! (i.e. to store it to your public GitHub repository 😅)

Oops, looks like I need to add the name of my search index in the `_config.yml` file:

```yaml
# _config.yml

algolia:
  application_id: 'paste_your_application_id_here'
  index_name: 'albums'
```

I've picked the name "albums", because that's what I want visitors to be able to search for, on my website. Type any name that you like, there!

Let's try to run the plug-in again:

```bash
$ ALGOLIA_API_KEY='paste_your_admin_api_key_here' bundle exec jekyll algolia
[✗ Error] No records found

Make sure you did not exclude too many files from indexing using the
`files_to_exclude` option. You are currently excluding the following files:
    index.html, index.markdown, index.mkdown, index.mkdn, index.mkd, index.md
```

Damn it!

Ok, let's remove any possible exclusions, by completing the `_config.yml` like this:

```yaml
# _config.yml

algolia:
  application_id: 'paste_your_application_id_here'
  index_name: 'albums'
  files_to_exclude: []
```

... and try to run again:

```bash
$ ALGOLIA_API_KEY='paste_your_admin_api_key_here' bundle exec jekyll algolia
Configuration file: /Users/adrienjoly/Dev/adrienjoly/jekyll-tutorial/_config.yml
Processing site...
Rendering to HTML (100%) |======================================================================|
Extracting records (100%) |=====================================================================|
Updating settings of index albums
Getting list of existing records
Updating records in index albums...
Records to delete: 0
Records to add: 4
✔ Indexing complete
```

It worked! 🙌

Let's see how our search index looks, back in our Algolia dashboard:

![screenshot of algolia dashboard with index of albums](https://thepracticaldev.s3.amazonaws.com/i/9mpl1mw32vdmxaw0mgzr.png)

The good news is that the dashboard displays "Blood sugar sex magik", which is one of the albums listed on my website!

The bad news is that it contains 4 records, whereas my collection currently contains 2 albums. Something wrong must have happened during the indexing process... 🤔

Thanks to an error message I had got previously when trying to run `bundle exec jekyll algolia` (and that I did not include completely above, for simplicity), I discovered that it was possible to specify what HTML elements should be indexed: the `nodes_to_index` property.

So let's tell Jekyll-Algolia to index our `article` elements (as specified in the Jekyll template we had written during [the previous tutorial](https://dev.to/adrienjoly/how-to-maintain-a-collection-of-music-albums-online-using-jekyll-and-github-pages-3hd6)), by updating our `_config.yml` file:

```yaml
# _config.yml

algolia:
  application_id: 'paste_your_application_id_here'
  index_name: 'albums'
  files_to_exclude: []
  nodes_to_index: 'article'
```

After running the `bundle exec jekyll algolia` command again and refreshing the Algolia dashboard, we now have 2 albums in our search index! ✊

Quick test before moving on: let's search for one of my albums, from Algolia's dashboard:

![testing album search from algolia dashboard](https://thepracticaldev.s3.amazonaws.com/i/765336euv5iojk68elaj.png)

✅ Working as expected!


# Step 3. Integrate the search bar

It's very cool to have a search index automatically populated from our website! But it's quite useless before we display a search bar on it. And this new step is beyond the scope of Jekyll-Algolia: we now need to use one of Algolia's search clients into our website.

## (3.1) Import `instantsearch.js`

Let's head to the "Build Search UI" section of [Algolia's Documentation website](https://www.algolia.com/doc/). We are gonna use the easiest and most versatile UI integration: [InstantSearch.js](https://community.algolia.com/instantsearch.js/).

As advised in the [Getting started](https://community.algolia.com/instantsearch.js/v2/getting-started.html) instructions, let's import the CDN-based stylesheets and script into our `index.md` file:

```md
<link rel="stylesheet" href="index.css" />

## Albums

{% for album in site.data.albums %}
  <article>
    <a href="{{ album.url }}">
      <img src="{{ album.img }}" alt="{{ album.title }} {{ album.artist }}"/>
      <p>{{ album.title }}</p>
    </a>
    <p>by {{ album.artist }}</p>
    {% if release-date %}
      <span class="release-date">{{ album.release_date | date: "%b %-d, %Y" }}</span>
    {% endif %}
  </article>
{% endfor %}

<!-- algolia search -->

<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/instantsearch.js@2.8.1/dist/instantsearch.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/instantsearch.js@2.8.1/dist/instantsearch-theme-algolia.min.css">

<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@2.8.1"></script>

<script>
  /* we are going to add some javascript code here */
</script>

<!-- end of algolia search --> 
```

I like to test regularly that I did not break anything:

```bash
$ bundle exec jekyll serve --incremental

  Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
```

When I open `http://127.0.0.1:4000` in my browser (Google Chrome), I find the following errors in the JavaScript console:

![javascript error when trying to import algolia instantsearch from localhost](https://thepracticaldev.s3.amazonaws.com/i/jct9kwayph0jht9fy7oj.png)

1. Refused to apply style from 'https://cdn.jsdelivr.net/npm/instantsearch.js@2.8.1/dist/instantsearch.min.css' because its MIME type ('text/plain') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
2. Refused to apply style from 'https://cdn.jsdelivr.net/npm/instantsearch.js@2.8.1/dist/instantsearch-theme-algolia.min.css' because its MIME type ('text/plain') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
3. GET https://cdn.jsdelivr.net/npm/instantsearch.js@2.8.1 404 ()
4. Refused to execute script from 'https://cdn.jsdelivr.net/npm/instantsearch.js@2.8.1' because its MIME type ('text/plain') is not executable, and strict MIME type checking is enabled.
5. Uncaught ReferenceError: instantsearch is not defined

Let's ignore CSS errors for now (1, 2), and start with JavaScript errors (3, 4, 5) instead, because they are the ones that prevent the search from initialising:

The last error (5) is caused by the fact that the `instantsearch.js` could not be loaded (3, 4). And apparently, it was not able to load because the provided URL does not have the expected MIME type. It could be that MIME type checking is enforced when opening a webpage from `localhost`, like I'm doing now.

The same problem seems to happen with CSS files.

When trying to open theses files in separate browser tabs, I understand that it's not only a matter of MIME types, these URLs are returning pages with an error message: "*Couldn't find the requested release version 2.8.1.*"!

By removing the "@2.8.1" part of these URLs, they seem to work fine! After applying this same change to my `index.md` file and refreshing the page, all errors disappeared from the JavaScript console! 😇

## (3.2) Instantiate the search bar and hits

Now that `instantsearch.js` is imported properly, we need to write some code to instantiate our search bar and hits.

First, we are going to add `<div>` elements in `index.md`, so that `instantsearch.js` knows where to integrate the search bar and the hits.

As advised in the "[Add a searchbox](https://community.algolia.com/instantsearch.js/v2/getting-started.html#add-a-searchbox)" part of Instantsearch's tutorial, we start by adding the following HTML code between our Jekyll template (to display albums) and the section that imports `instantsearch.js`:

```html
<div id=="search-box">
  <!-- SearchBox widget will appear here -->
</div>

<div id="hits">
  <!-- Hits widget will appear here -->
</div>
```

Remember the `/* we are going to add some javascript code here */` comment we had written in a `<script>` element of `index.md`? The time has come to fill this `<script>` element!

As advised in the "Initialization" and "Display results" of [Instantsearch's tutorial](https://community.algolia.com/instantsearch.js/v2/getting-started.html#initialization), let's add the following JavaScript code there:

```js
  const search = instantsearch({
    // TODO: enter our own algolia credentials here
    appId: 'latency',
    apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
    indexName: 'instant_search',
    routing: true
  });

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-box',
      placeholder: 'Search for albums'
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        empty: 'No results',
        item: '<em>Hit {{objectID}}</em>: {{{_highlightResult.name.value}}}'
      }
    })
  );

  search.start();
```

Now, let's refresh the `http://127.0.0.1:4000` browser tab to see if it works. (you may need to restart the `$ bundle exec jekyll serve --incremental` command)

That's what I get:

![screenshot of instantsearch.js with a curly brace glitch](https://thepracticaldev.s3.amazonaws.com/i/f1jzwe4i4zyxicmlez5w.png)

The search box is displayed nicely, but we're also seeing several `Hit : }` lines under it... 🤔

If we had been more attentive, we would have seen that the `bundle exec jekyll serve` command had given us a warning that seems linked to this problem:

```
Liquid Warning: Liquid syntax error (line 55): Unexpected character { in "{{{_highlightResult.name.value}}" in index.md
```

My hypothesis is that the template I had copy-pasted from Instantsearch's tutorial conflicts with Jekyll's template parser. If this hypothesis is right, moving this JavaScript code to a separate `.js` file should fix this problem.

I can confirm that my hypothesis was right: moving the JavaScript code to a new `search.js` file, and importing that file from `index.md` using `<script src="search.js"></script>` does the trick! 😁

So now, here is what I get:

![screenshot of instantsearch.js integration with default search index](https://thepracticaldev.s3.amazonaws.com/i/m03ii8ve6dwt2ifhrtz0.png)

The list displayed under the search bar does adapt in real-time when I type in it, but the hits are not albums!

## (3.3) Customise for our search index

We need to plug the right Algolia index to our `instantsearch.js` instance. In order to do that, we have to change the values of the `appId`, `apiKey` and `indexName` properties, to match the credentials of our own Algolia index.

> Note: These credentials will be used by `instantsearch.js` just to send search queries, so you should enter your "Search-Only API Key" here. (found on the same page as the "Admin API Key")

After doing that, I'm able to search my album collection:

![screenshot of instantsearch integration with untitled hits](https://thepracticaldev.s3.amazonaws.com/i/7ct7fu3tpb90fac8nbdp.png)

We're getting some hits when typing words that are part of our albums' names, but the name of the resulting albums are not displayed.

As you can see on your Algolia dashboard, the title of albums are stored in an attribute called `content`. So that's what we should display.

To do that, we need to update our hit template from `search.js`, from:

```js
      item: '<em>Hit {{objectID}}</em>: {{{_highlightResult.name.value}}}'
```

... to:

```js
      item: '<em>Hit {{objectID}}</em>: {{{_highlightResult.content.value}}}'
```

That should do! ✊


# Resulting files

You can find the source code what we produced in that github repository: [github.com/adrienjoly/jekyll-tutorial](https://github.com/adrienjoly/jekyll-tutorial).

Here are the files that we created or updated in this tutorial:

- `Gemfile`:

```Gemfile
# Gemfile

source 'https://rubygems.org'
gem 'github-pages', group: :jekyll_plugins

group :jekyll_plugins do
  gem 'jekyll-algolia', '~> 1.0'
end
```

- `_config.yml`:

```yaml
# _config.yml

algolia:
  application_id: 'paste_your_application_id_here'
  index_name: 'albums'
  files_to_exclude: []
  nodes_to_index: 'article'
```

- `index.md`:

```html
<link rel="stylesheet" href="index.css" />

## Albums

{% for album in site.data.albums %}
  <article>
    <a href="{{ album.url }}">
      <img src="{{ album.img }}" alt="{{ album.title }} {{ album.artist }}"/>
      <p>{{ album.title }}</p>
    </a>
    <p>by {{ album.artist }}</p>
    {% if release-date %}
      <span class="release-date">{{ album.release_date | date: "%b %-d, %Y" }}</span>
    {% endif %}
  </article>
{% endfor %}

## Search

<div id="search-box">
  <!-- SearchBox widget will appear here -->
</div>

<div id="hits">
  <!-- Hits widget will appear here -->
</div>

<!-- algolia search -->

<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/instantsearch.js/dist/instantsearch.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/instantsearch.js/dist/instantsearch-theme-algolia.min.css">

<script src="https://cdn.jsdelivr.net/npm/instantsearch.js"></script>

<script src="search.js"></script>

<!-- end of algolia search --> 
```

- `search.js`:

```js
const search = instantsearch({
  appId: 'R6Y1H83FNX',
  apiKey: 'b0f283176b810e5223f70e3ab3ac7c04',
  indexName: 'albums',
  routing: true
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-box',
    placeholder: 'Search for albums'
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      empty: 'No results',
      item: '<em>Hit {{objectID}}</em>: {{{_highlightResult.content.value}}}'
    }
  })
);

search.start();
```

# Next: Fix the UI

In this tutorial, we:
- created a search index on algolia.com
- setup Jekyll-Algolia to populate this index from our list of albums
- integrated instantsearch.js (despite a CDN issue)
- and plugged our own index to the search components

We also learned how to upgrade `ruby` and how to preview the Jekyll site from `localhost`.

Despite the fact that we have a working search bar on our album collection, the resulting website is not good looking, nor usable.

In the next tutorial, we will define what user experience we're aiming for, and implement it. Hopefully, our album collection will look great again, after that!

Stay tuned, and please share your comments, questions and suggestions, if any!
