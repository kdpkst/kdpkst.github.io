---
layout: projects
title: "Projects"
---

<section class="projects">
  <h1>Projects</h1>
  <div class="project-list">
    {% for project in site.data.projects %}
      <div class="project-card">
        <h2>{{ project.title }}</h2>
        <p>{{ project.description }}</p>
        <a href="{{ project.url }}" target="_blank">View Project</a>
      </div>
    {% endfor %}
  </div>
</section> 