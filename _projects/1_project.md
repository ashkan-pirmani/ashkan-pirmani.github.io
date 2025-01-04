---
layout: page
title: The Journey of Data Within a Global Data Sharing Initiative 🚀
description: A human story of collaboration, innovation, and the magic of federated data analysis.
img: assets/img/gdsi-logo.png
importance: 2
category: GDSI
giscus_comments: true
---

What happens when you try to solve a global health mystery using data? You get a journey full of collaboration, innovation, and a whole lot of learning. That’s exactly what we experienced while working on a project to better understand multiple sclerosis (MS) and its interaction with COVID-19.

This is the story of how we connected the dots, shared the insights, and changed the way we think about healthcare data.

![Federated Pipeline Architecture](/assets/img/gdsi-infra.png)

---

## The Challenge: A Puzzle With Missing Pieces 🧩

Diseases like MS are rare. That means the data we need to understand them is sparse, scattered, and often locked away in different systems around the world. On top of that, privacy concerns and data security make sharing this information really tricky.

So, the question was: **How do we make sense of it all while keeping sensitive data safe?**

---

## The Big Idea: Federated Data Analysis 💡

We needed a way to analyze the data without physically moving it around. That’s where **federated data analysis** came in. It’s a smart approach that keeps the data where it is while still letting researchers extract insights.

Here’s how it works:

1. **Data Stays Local:** Institutions keep the raw data on their own servers.
2. **Algorithms Travel:** Instead of moving data, we send analysis scripts to the institutions.
3. **Results Come Back:** The algorithms run locally, crunch the numbers, and send back aggregated results—no sensitive details included.

It’s like asking libraries around the world how many books they have on a topic without ever seeing the books themselves. 📚

---

## How It All Came Together 🛠️

To make this work, we created a pipeline with three main streams of data:

### 1. Direct Entry

Patients and clinicians could directly enter data into a secure system using standardized forms. Simple, right? 📝

### 2. Core Data Set Sharing

Institutions shared pre-approved datasets that were cleaned and anonymized before being uploaded to a central platform.

### 3. Federated Model Sharing

This was the real game-changer. Instead of moving sensitive data, we used tools like `Docker` to run analysis scripts directly on the institutions’ servers. The scripts would create summaries (aggregated data), which we could analyze centrally. 🧠

This setup allowed us to gather insights from over **80 countries** without compromising privacy.

---

## Visualizing the Workflow 📊

Here’s a look at how GDSI’s pipeline works:

### Federated Pipeline Architecture

This diagram showcases the tools and technologies that power GDSI's federated model sharing, from Docker containers to Jupyter dashboards.

![Federated Pipeline Architecture](/assets/img/gdsi-flow.png)

### Data Sharing Models

The visual below highlights the three main data-sharing approaches: Direct Entry, Core Data Set Sharing, and Federated Model Sharing.

![Data Sharing Models](/assets/img/gdsi-arch.png)

### Data Processing Workflow

Here’s how data moves through the system, with preprocessing, aggregation, and analysis steps all designed to ensure privacy and quality.

![Data Processing Workflow](/assets/img/fed-pipeline.png)

---

## The Results: Insights That Matter 🌍

Thanks to this innovative approach, we were able to:

- **Build the Largest Dataset:** We collected data from thousands of MS patients who had COVID-19 across 80+ countries.
- **Identify Key Trends:** For example, we discovered that some therapies, like `rituximab` and `ocrelizumab`, increased the risk of severe COVID-19 outcomes (e.g., hospitalization).
- **Support Global Guidelines:** These findings helped shape treatment recommendations and protect vulnerable patients during the pandemic.

---

## Challenges Along the Way 🚧

Of course, it wasn’t all smooth sailing. Here’s what we faced:

- **Different Data Formats:** Think of it as trying to fit pieces from different puzzles together. Our solution? A standardized `data dictionary` to make everything match.
- **Privacy Concerns:** Sharing health data is sensitive business. Federated analysis kept data safe and secure.
- **Global Coordination:** With contributors from so many countries, aligning everyone’s efforts was a challenge—but one we overcame with lots of communication and trust.

---

## Why This Matters 🌟

This project wasn’t just about MS or COVID-19. It’s a blueprint for how we can approach health data challenges in the future. Whether it’s cancer, rare diseases, or mental health, this kind of system can help researchers collaborate globally without compromising privacy or security.

It’s a glimpse into the future of healthcare: one where data drives better decisions, faster.

---

## Final Thoughts ❤️

This journey wouldn’t have been possible without the incredible collaboration of researchers, clinicians, and organizations worldwide. From tech partners like `QMENTA` and `AWS` to the patients who trusted us with their data—you made this vision a reality.

If you’re curious to dive deeper into the technical details or see the full results, check out our paper: [The Journey of Data Within a Global Data Sharing Initiative](https://doi.org/10.2196/48030) (JMIR Medical Informatics, 2023).

Here’s to more collaborations, more breakthroughs, and a healthier future for all. 💪
