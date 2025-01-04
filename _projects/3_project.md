---
layout: page
title: Predicting MS Progression with Personalized Federated Learning
description: How we used federated learning to make disability progression predictions in multiple sclerosis more accurate and secure.
img: assets/img/fl_ms_progression.jpg
importance: 4
category: PhD
giscus_comments: true
---

# Predicting MS Progression with Personalized Federated Learning 🧠🌍

What if we could predict how multiple sclerosis (MS) progresses for each patient while keeping their data safe and secure? That’s the vision behind our latest research. Using **personalized federated learning (PFL)**, we created smarter, more tailored predictions without ever moving sensitive patient data. Here’s how it all came together.

---

## Why Predicting MS Progression Is So Hard 🧩

MS is a tricky disease. No two patients experience it the same way, and predicting how it will progress is a challenge. Doctors need real-world data from thousands of patients to make better decisions, but there are a few big problems:

- **Data is Scattered**: Patient records are spread across hospitals, often in different formats.
- **Privacy Concerns**: Sharing sensitive health data isn’t just risky—it’s often illegal.
- **One-Size-Fits-All Models Don’t Work**: MS progression varies widely, and traditional models struggle to handle this diversity.

So, we asked ourselves: **How can we create accurate, personalized predictions while respecting patient privacy?**

---

## The Big Idea: Personalized Federated Learning 💡

Enter **personalized federated learning (PFL)**. It’s like regular federated learning (FL) but smarter. Instead of training one global model for everyone, PFL tailors models to local data while still collaborating with other sites. Think of it as:

- **Privacy First**: Data stays at the hospital or clinic—it never moves.
- **Tailored Learning**: Each site trains a model that understands their unique patient population.
- **Collaboration Without Sharing**: Institutions benefit from shared knowledge without exposing sensitive data.

In short, PFL combines the best of both worlds: **privacy and personalization**.

---

## How We Put It to the Test 🔬

To see if PFL could handle MS, we turned to the **MSBase registry**, one of the largest databases of real-world MS patient data. Here’s what we did:

- **Data**: We used data from over **26,000 patients** across multiple sites.
- **Task**: Predict whether a patient’s disability would worsen within a year.
- **Methods**: We compared five approaches:
  1. **Centralized Models**: Training on pooled data (accurate but not private).
  2. **Standard Federated Learning (FL)**: A single global model across all sites.
  3. **Personalized Federated Learning (PFL)**:
     - **Fine-Tuning**: Adapting the global model to each site.
     - **AdaptiveDualBranchNet**: A novel architecture that personalizes dynamically.
  4. **Local Models**: Each site trains its own model independently.

---

## What We Found 🌟

Here’s the exciting part: PFL didn’t just work—it excelled.

- **Centralized Models Were Still King**: Pooled data gave the best performance but required full data sharing (a no-go for privacy).
- **Standard FL Fell Short**: One-size-fits-all models couldn’t handle the variability of MS patients.
- **PFL Struck the Perfect Balance**: Fine-tuning and AdaptiveDualBranchNet came close to centralized performance while keeping data private.
  - **AdaptiveDualBranchNet** achieved a **ROC-AUC of 0.8398**, rivaling centralized models and outperforming standard FL by 7%.

These results show that PFL isn’t just a compromise—it’s a step forward for privacy-preserving, personalized healthcare.

---

## Why This Matters ❤️

At the end of the day, this research isn’t just about numbers—it’s about people. MS patients deserve care that’s tailored to their needs, and doctors need tools that help them make better decisions. Here’s what this means:

- **Better Predictions, Safer Data**: Patients can benefit from AI without sacrificing their privacy.
- **Global Collaboration**: Hospitals and researchers can work together without worrying about sharing sensitive information.
- **A Blueprint for the Future**: PFL isn’t just for MS—it could transform research for other complex diseases.

---

## Challenges and What’s Next 🚧

Of course, there’s still work to do. PFL is a big step forward, but it comes with its own challenges:

- **Complexity**: Personalization adds computational overhead.
- **Communication Costs**: Fine-tuning requires frequent communication between sites and servers.
- **Room for Innovation**: We’re exploring ways to make PFL even more efficient and scalable, like using differential privacy or dynamic tuning.

The potential is enormous, and we’re just getting started.

---

## Learn More 📖

If you’re as excited about this as we are, check out the full paper for all the technical details:

- **Paper**: [Personalized Federated Learning for MS Disability Prediction](https://github.com/ashkan-pirmani/FL-MS-RWD)

Together, let’s reimagine what’s possible in personalized healthcare. 🚀
