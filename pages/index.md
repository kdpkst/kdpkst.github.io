---
layout: about
title: "About Me"
permalink: /
---

<section class="about">
  <img src="{{ '/assets/images/placeholder.png' | relative_url }}" alt="Self Portrait" class="self-portrait">
  <h2>Who am I</h2>
  <p>{{ site.data.about.self_introduction }}</p>
  <h2>Education</h2>
  <ul>
    {% for edu in site.data.about.education %}
      <li>{{ edu.degree }}, {{ edu.school }} ({{ edu.year }})</li>
    {% endfor %}
  </ul>
  <h2>Professional Experience</h2>
  <ul>
    {% for exp in site.data.about.experience %}
      <li>{{ exp.title }}, {{ exp.company }} ({{ exp.years }})</li>
    {% endfor %}
  </ul>
  <h2>Hobbies & Interests</h2>
  <ul>
    {% for hobby in site.data.about.hobbies %}
      <li>{{ hobby }}</li>
    {% endfor %}
  </ul>
</section> 