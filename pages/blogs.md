---
layout: blogs
title: Blogs
permalink: /blogs/
---

<section class="blogs">
  <h1>Blogs (still in development)</h1>
  <input type="text" id="blog-search" placeholder="Search blogs...">
  <div class="blog-list">
    {% for post in site.posts %}
      <div class="blog-card" data-category="{{ post.categories | join: ' ' }}">
        <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
        <p>{{ post.excerpt }}</p>
        <span class="blog-meta">{{ post.date | date: "%b %d, %Y" }} | {{ post.categories | join: ', ' }}</span>
      </div>
    {% endfor %}
  </div>
</section>
<script src="{{ '/assets/js/blog-search.js' | relative_url }}"></script>