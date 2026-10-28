---
layout: page
title: About
permalink: /about/
weight: 3
---

<div class="tech-only" markdown="1">

# **About Me**

I'm **{{ site.author.name }}**, a software engineer who enjoys turning complex problems into reliable, useful products. At Allica, I build banking applications and microservices with Kotlin and Spring Boot. Previously at Deutsche Bank, I worked on graph-based document workflows and cloud processing solutions that handled over five million documents.

My experience spans backend and frontend development, cloud platforms, and automation, with tools including Python, Java, React, Azure, and Google Cloud. From building business banking products to earning recognition for innovation, I bring curiosity and a practical approach to creating software that makes a difference.

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
