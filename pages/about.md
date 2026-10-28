---
layout: page
title: About
permalink: /about/
weight: 3
---

<div class="tech-only" markdown="1">

# **About Me**

Hi I am **{{ site.author.name }}**,<br>
I am about to complete my second year of engineering from Computer branch. I love coding and is pasionate about open source development. I am pretty good in <strong>competetive coding</strong>. I use <strong>Python</strong> preferably as my development language. I am very much comfortable around Web-development world. I am currently exploring the world of <strong>deep-learning</strong>.<br>Apart from my technical life, I am in deep love with <strong>Anime</strong> world. If you are into Anime, ping me anytime on Facebook :)

<p class="text-center">
{% include button.html link="/assets/Shailesh-Resume-04oct26.pdf" text="Download my CV" %}
</p>

<div class="row">
{% include skills.html title="Programming Skills" source=site.data.programming-skills variant="cards" %}
</div>
<div class="row">
{% include skills.html title="Other Skills" source=site.data.other-skills %}
</div>

<div class="row">
{% include timeline.html %}
</div>
</div>

<section class="hobby-only hobby-about">
  <p class="eyebrow">BEYOND THE SCREEN</p>
  <h1>About me<span>.</span></h1>
  <p>A space for the interests, experiences, and stories that make up life beyond work.</p>
  <div class="hobby-placeholder"><span aria-hidden="true">✦</span><div><h2>More to come</h2><p>Personal interests and stories will find their home here.</p></div></div>
  <a class="button-secondary" href="{{ '/travel/' | relative_url }}">Explore travel <span aria-hidden="true">→</span></a>
</section>
