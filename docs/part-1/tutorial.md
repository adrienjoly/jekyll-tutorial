---
title: How to maintain a collection of music albums online, using Jekyll and Github Pages
published: true
description: A tutorial that explains why and how I maintain my list of music albums on my personal website.
tags: tutorial, gh-pages, jekyll, static-web
---

I love to make lists.

Lists of tasks (ToDo), of books to read, of cities I visited, of places I'd like to go, of my favorite restaurants in Paris, of the most recommendable freelancers...

As a matter of fact, I'm pretty sure that at least half of all the business and productivity apps out there were made to help us maintain lists.

# The Motivation

One of my lists is very dear to my heart. It's my collection of music albums.

In the past, it used to be materialised by a stack of cassettes. Then, it turned into a shelf of CDs. Then, it became a list of folders full of MP3 files, stored in the hard-disk of my computer.

More recently, it's become more convenient to stream music directly from the Internet, without having to own anything, thanks to services like Spotify. Eventually, my collection of albums turned into a very long list of playlists, stacked on the left of my Spotify window, without cover art...

I've definitely gained in terms of convenience, saving space in my appartment, and reduced fear of losing (or damaging) material records. But what about the pleasure of browsing my collection randomly, while appreciating the beautiful cover art? Lost.

Let's solve this. Let's bring back the joy of having a beautiful music collection again!

# Existing solutions

There are many ways to keep an album collection.

Firstly, Spotify does allow me to *Add* an album to my collection, to later find it in the "Albums" page. But unfortunately, this list also includes the album containing each track I've ever liked on Spotify, even though I don't care about the rest of that album... So in the end, it does not really look like a hand-picked collection of albums.

So let's ask Google: "album collection online". First result is [discogs.com](https://www.discogs.com). This website does allow to create a profile and add albums to my collection, with cover art! But it was clearly designed for vinyl disc collectors, as each album is listed in various editions with different track lists, and you have to pick *one* of them in order to add it to your collection. Too cumbersome for me... Also, I did not find any way to play the album in one click from there.

What if I used a more generic service to maintain my collection in a visual manner? Pinterest seems like a good candidate! Unfortunately, Pinterest just provides a full-text description field for each image, making it impossible to browse albums by artist or genre...

Maybe I should keep my collection in a database, and setup a piece of software to maintain it? A content management system (like Wordpress) with a few plug-ins and a good theme could probably work. But at what cost? I'd need to host it on a PHP server, run software updates, tweak plug-ins and themes that somebody else made, and probably pay for hosting. That seems too complicated.

What about keeping my list in a static HTML file with simple CSS styling to make it look like a material album collection? That's definitely less complex and costly to publish! But it's also easy to forecast the limitations: having to edit HTML code every time I want to add an album, necessity to add JavaScript / DOM manipulation in order to make it browseable by artist and searchable...

What if I could maintain my list of albums in a text file, and have HTML files automatically generated from it? 🤔

Isn't that the promise of Jekyll, supported for free by Github Pages?

That's it! I finally found a good excuse to learn how to use Jekyll!

# Designing the solution

Let's recap what I expect from my album collection:

1. Display cover art in a beautiful gallery
2. Play the album in one-click, from Spotify or other
3. Browse by artist or genre
4. Quick and easy CRUD operations (i.e. Create, Retrieve, Update and Delete albums)
5. Fast search
6. Low risk of data loss or corruption
7. Available online, for the world to see!
8. Easily forkable, for other developers who want to make their own collection.

I know that it's quite easy for me to build a HTML+CSS web page that would cover points 1 and 2.

I've read that Jekyll can generate static HTML pages based on data files expressed in YAML, which is an almost-plain-text structured markup format similar to Markdown. This could cover points 3 and 4.

I also know that Github Pages is my favorite way to publish web pages for free, and that it supports Jekyll out of the box. Meaning that, if I put Jekyll files in my repository, Github will automatically generate the resulting HTML pages. And of course, I can run Jekyll offline on my laptop as well. That will cover points 6 to 8.

[![Github Pages with Jekyll support](https://thepracticaldev.s3.amazonaws.com/i/68yc4gyhko7m4id8s5bv.png)](https://pages.github.com/)

What about fast search? Oh, wait! I work for Algolia, and one of my colleagues made a plug-in to make any Jekyll website searchable: [Jekyll-Algolia](https://community.algolia.com/jekyll-algolia/)!

That sounds like a realistic and exciting plan! Let's make this a reality!

# Step 1. Initialise a Jekyll page on Github Pages

To get started, let's set a simple goal to ourselves: make Github Pages render and publish a HTML file out of a simple Markdown file.

I assume that you have a Github repository (fresh or not) ready to host your Jekyll files. If not, please create one and make sure that you are able to commit and push files to it from your computer. I will follow each step on that one: [github.com/adrienjoly/jekyll-tutorial](https://github.com/adrienjoly/jekyll-tutorial).

Let's add a `index.md` file at the root of the `master` branch of our repository, with the following contents:

```md
Hello world!

This is a **markdown** file.
```

Now, let's ask Github Pages to render and publish it as a website. For that, go to your repository's settings page (mine: https://github.com/adrienjoly/jekyll-tutorial/settings), and pick the `master` branch as "Source", in the "GitHub Pages" section:

![pick the branch for github pages](https://github.com/adrienjoly/album-shelf/raw/master/docs/github-repo-pages.png)

Then click "Save".

Now, you should be able to see your index by opening the URL `https://<your_username>.github.com/<your_repo_name>` in your web browser. If everything went well, it must have been rendered in HTML by Github Pages, thanks to Jekyll, and look like that:

![screenshot of index.md rendered in HTML by github pages and jekyll](https://thepracticaldev.s3.amazonaws.com/i/181lwcjbezci8pql3vha.png)

Good job!

# Step 2. Render a simple list using Jekyll

Now, let's integrate a simple list into that page.

In order to do that, we will:
1. create a `.yaml` file in the `_data` folder,
2. and add a template to integrate its data in `index.md`.

In my case, I'm going to create a `_data/albums.yaml` file with the following contents:

```yaml
- title: Blood Sugar Sex Magik
  artist: Red Hot Chili Peppers
  img: https://i.scdn.co/image/5a6a1c6514398dc4004c6348a83d77694a3883d4
  url: https://open.spotify.com/album/30Perjew8HyGkdSmqguYyg
```

And then, I add the following template to `index.md`:

```md
## Albums

{% for album in site.data.albums %}
- [{{ album.title }} by {{ album.artist }}]({{ album.url }})
{% endfor %}
```

This template will render a HTML list item for every item from `_data/albums.yaml`. Each item will be render as a hyperlink displaying the title and artist of the album, and linking to its Spotify page.

Let's refresh `https://<your_username>.github.com/<your_repo_name>`. After giving Github a few seconds to re-render the website, the resulting page should look like that:

![yaml list rendered in html thanks to jekyll](https://thepracticaldev.s3.amazonaws.com/i/q7m3720s0ja6vhpjaljs.png)

We're making some progress!

Of course, you can add as many items in `_data/albums.yaml` as you like!

For more information about the syntax of the YAML format, read [The YAML Format (Symfony Docs)](https://symfony.com/doc/current/components/yaml/yaml_format.html).

# Step 3. Make it look better

Now that we know how to create a list in YAML, and how to render it in Markdown, let's make it look like a proper collection of albums!

The first thing that is missing is cover art.

In order to display images, we can of course use the Markdown syntax: `![alt](src)`. But, in order to get more flexibility while designing our list, we will use some good old HTML instead. Yes, Jekyll does supports HTML markup in a Markdown files.

Let's replace the template we had integrated in the previous step by this one:

```md
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
```

Assuming that you added at least a second album to your list, the resulting page would probably end up looking like this:

![list of albums with cover art](https://thepracticaldev.s3.amazonaws.com/i/sragw5z78zqfqpg1mr3u.png)

Of course, we can do better by adding a bit of styling in `index.css`:

```css
* {
  box-sizing: border-box;
}

article {
  display: inline-block;
  width: 320px;
  height: 420px;
  padding: 8px;
  overflow: hidden;
}

article img {
  width: 320px;
  height: 320px;
}

.markdown-body article p {
  margin-bottom: 0;
}

.release-date {
  color: gray;
  font-size: 90%;
}
```

But, even after refreshing the resulting page, you'll see that this stylesheet was not automatically picked up by Jekyll...

So, now that we know that HTML markup is supported on top of Markdown, let's add a `<link>` element at the top of `index.md`, to load our stylesheet:

```html
<link rel="stylesheet" href="index.css" />
```

After refreshing the page, you will hopefully see some UI improvements:

![album list with cover art and css styling](https://thepracticaldev.s3.amazonaws.com/i/oc4k59snx3shnyeslcjc.png)

Looking good!

Now, feel free to clean `index.md` from our old tests. (e.g. "hello world")

# Summary of progress

To illustrate our progress, let's update the list of requirements I had proposed at the beginning of this article:

1. ~~Display cover art in a beautiful gallery~~ ✅
2. ~~Play the album in one-click, from Spotify or other~~ ✅
3. Browse by artist or genre
4. ~~Quick and easy CRUD operations (i.e. Create, Retrieve, Update and Delete albums)~~ ✅ (*room for improvement*)
5. Fast search
6. ~~Low risk of data loss or corruption~~ ✅
7. ~~Available online, for the world to see!~~ ✅
8. ~~Easily forkable, for other developers who want to make their own collection.~~ ✅

Whoa, we've done quite a lot, with so few lines of code and so little effort! ✊

# Next steps

So what can we do to make our collection ever better?

For starters, we have not implemented any way to browse by artist or genre yet. There are many ways to do this, and I'm sure that would make an interesting follow-up to this article!

You saw that it was quite easy to maintain the collection in YAML. But we can do better. It would be awesome to automatically populate the album data after typing just its name. Maybe we could achieve that by building a command line interface that would query Spotify's API and update `albums.yaml` automatically!

Search is also lacking. It would be interesting to try out [Jekyll-Algolia](https://community.algolia.com/jekyll-algolia/), as I proposed earlier.

One more thing: what if I want to use my album collection while being offline? Worse, what if Github Pages dies? Can we run Jekyll ourselves, to generate the HTML website from our `index.md` template and our `albums.yaml` data file? Yes, we can! We just need to setup some software tools on our computer, and add a little bit of configuration to the Jekyll website. That's yet another topic that we can explore together in a next article.

# Conclusion

I hope that this article convinced you that Jekyll and Github Pages make a powerful (yet easy to use) duo to maintain beautiful and flexible lists online.

As a lover of the Web, I wish that more lists were maintained that way, and that we rely less on closed apps to hold our data. This article aims to be a modest contribution towards promoting the DIY (*do it yourself*) philosophy to the way we manage our lists of things, and more generally, our data.

I'd love to read your feedback, ideas, and suggestions after reading this article. Please let me know what you'd like me to write about next!
