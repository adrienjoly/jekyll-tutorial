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
