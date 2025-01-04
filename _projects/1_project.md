---
layout: page
title: The Journey of Data Within a Global Data Sharing Initiative 🚀
description: A human story of collaboration, innovation, and the magic of federated data analysis.
img: assets/img/gdsi-logo.png
importance: 2
category: GDSI
giscus_comments: false
---

What happens when you try to solve a global health mystery using data? You get a journey full of collaboration, innovation, and a whole lot of learning. That’s exactly what we experienced while working on a project to better understand multiple sclerosis (MS) and its interaction with COVID-19.

This is the story of how we connected the dots, shared the insights, and changed the way we think about healthcare data.

<div style="text-align: center;">
  <img src="/assets/img/gdsi-infra.png" alt="Data Preprocessing Workflow" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
</div>
*Figure 1: A streamlined view of data managment pipeline of GDSI*

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

<div style="text-align: center;">
  <img src="/assets/img/fed-pipeline.png" alt="Data Preprocessing Workflow" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
</div>
*Figure 2: The latest federated pipeline. This is a container composed of 3 primary components. The first component is the base image, which forms the bedrock of the infrastructure. This base image uses Alpine Linux as its underlying operating system, which allows the container to be fine-tuned with other software development kits for further refinements and functionalities. The remaining 2 components, the backend and frontend, are constructed on top of this base image. The backend consists of a suite of Python scripts, which are tasked with data quality assessment, enhancement, cleaning, and analysis. These scripts collaboratively process the incoming mapped data, preparing it for subsequent analysis. By contrast, the frontend was crafted using Microsoft’s ASP.NET Core framework and the C# programming language. Within this pipeline, there is a customizable automation center module. This module can be adapted to meet the specific needs and requests of data partners. It also integrates Crontab, a tool that automates predefined tasks and outlines complex pipelines for execution at various intervals. The automation center module also links the container to the GitHub and Docker Hub version control systems. This connection ensures the use of the most recent scripts and codes published by data analysts. SDK: software development kit.*

### Data Sharing Models

The visual below highlights the three main data-sharing approaches: Direct Entry, Core Data Set Sharing, and Federated Model Sharing.

<div style="text-align: center;">
  <img src="/assets/img/gds-arch.png" alt="Data Preprocessing Workflow" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
</div>
*Figure 3: The global data sharing initiative data streams detailing the initiative’s inclusive approach through a hybrid 3-layer data acquisition architecture: (1) direct entry, where individuals upload their data via a web-based form; (2) core data set sharing, where registries upload patient-level data to the central platform under signed data transfer agreements and ethics approvals; and (3) federated model sharing, allowing registries with restrictive policies to participate without directly submitting patient-level data to the central platform.*

### Data Processing Workflow

Here’s how data moves through the system, with preprocessing, aggregation, and analysis steps all designed to ensure privacy and quality.

<div style="text-align: center;">
  <img src="/assets/img/gdsi-flow.png" alt="Data Preprocessing Workflow" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
</div>
*Figure 4: The global data sharing initiative’s end-to-end real-world data analysis pipeline. Step I illustrates the standardization process, which serves as the foundation of this architecture. In this phase, data custodians are requested to map their data to the “COVID-19 in multiple sclerosis core data set” (here referred to as the data dictionary). This process applies only to the core data set and federated model sharing registries, as direct entry is already embedded with a data dictionary via the web form. Step II involves the data acquisition pipeline, featuring distinct levels of data acquisition that depend on the data holder’s willingness and internal policies, all conducted in line with ethical and legal standards. Direct entry, core data set sharing, and federated model sharing constitute the 3 data stream levels. The first 2 levels interact directly with a central platform where the core dataset is shared as static files, in this instance, Comma Separated Values (CSV), whereas federated registries necessitate additional steps before submitting outcomes to the central platform. To incorporate federated registries into the pipeline, predefined queries are dispatched alongside Docker containers to the local side of the registries. The results of these containers are then shipped back to the central platform. In step III, data from different data holders are stored in separate layers to facilitate the next data integration process. Data integration, the subsequent step in the pipeline, entails consolidating data from distinct layers into a comprehensive data set. Step IV emphasizes the utilization of the integrated data set for further data exploration and analysis. Step V highlights the local dashboard, which serves as a quality check, enabling data providers to give feedback on their uploaded data as an additional sanity check. Step VI underscores the online dashboard that has been fed by the integrated data set, utilized by the taskforce during the development of the research questions to ascertain the feasibility of the study and to monitor the data being collected. In step VII, a Jupyter Notebook is provided to the data analysis team, securely connected to the integrated data set, facilitating statistical analysis.*

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

This journey wouldn’t have been possible without the incredible collaboration of researchers, clinicians, and organizations worldwide.

If you’re curious to dive deeper into the technical details or see the full results, check out our paper: [The Journey of Data Within a Global Data Sharing Initiative](https://doi.org/10.2196/48030) (JMIR Medical Informatics, 2023).

Here’s to more collaborations, more breakthroughs, and a healthier future for all. 💪
