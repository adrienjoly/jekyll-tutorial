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
