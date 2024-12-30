// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "For a detailed CV, feel free to drop me a message.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "news-i-defended-my-phd-i-am-beyond-thrilled-to-share-that-i-have-successfully-defended-my-phd-titled-from-centralized-to-federated-the-journey-of-data-in-healthcare-supervisors-and-co-supervisors-yves-moreau-supervisor-liesbet-m-peeters-supervisor-niels-hellings-co-supervisor-what-s-it-all-about-real-world-data-rwd-in-healthcare-holds-immense-potential-but-is-often-tangled-in-challenges-like-fragmented-data-across-various-healthcare-systems-strict-privacy-and-legal-regulations-difficulty-making-data-findable-accessible-interoperable-and-reusable-fair-these-issues-are-especially-problematic-for-conditions-like-multiple-sclerosis-ms-where-the-disease-s-low-prevalence-dispersed-rwd-variable-data-formats-quality-standards-and-guidelines-more-barriers-what-did-my-research-do-my-thesis-advocates-for-a-shift-from-centralized-data-analysis-to-a-federated-approach-federated-analysis-allows-distributed-datasets-to-be-analyzed-without-centralization-preserving-privacy-and-data-integrity-️-three-pillars-of-my-work-1️⃣-hybrid-data-management-pipeline-supports-integration-of-diverse-data-sources-successfully-implemented-in-the-global-data-sharing-initiative-for-covid-19-and-ms-resulted-in-the-largest-cohort-of-ms-and-covid-19-data-ever-collected-2️⃣-federated-learning-for-everyone-fl4e-framework-empowers-stakeholders-to-better-leverage-rwd-through-adaptable-federated-analysis-tools-introduced-the-concept-of-a-degree-of-federation-to-balance-centralization-vs-decentralization-️-3️⃣-federated-analysis-in-ms-research-used-routine-clinical-data-to-predict-disability-progression-in-ms-proposed-novel-techniques-to-improve-federation-performance-proved-federated-analysis-is-a-robust-alternative-to-centralized-methods-why-it-matters-this-work-paves-the-way-for-more-inclusive-privacy-aware-and-pragmatic-technologies-in-healthcare-by-addressing-critical-gaps-federated-data-analysis-can-drive-innovation-collaboration-and-better-outcomes-for-patients-worldwide-️-️-thank-you-a-heartfelt-thank-you-to-my-supervisors-collaborators-and-everyone-who-supported-me-on-this-journey-your-guidance-and-encouragement-made-this-milestone-possible-here-s-to-the-next-chapter-of-advancing-healthcare-through-technology",
          title: '🎉🎓 I DEFENDED MY PHD! 🎓🎉 I am beyond thrilled to share that...',
          description: "",
          section: "News",},{id: "news-dr-doctor-squared",
          title: 'Dr² (Doctor Squared)',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/ashkan_pirmani", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/ashkan-p-3b8a8896/", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Socials',
        handler: () => {
          window.open("https://www.researchgate.net/profile/Ashkan-Pirmani# your profile on ResearchGate/", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=RC2DM7kAAAAJ", "_blank");
        },
      },{
        id: 'social-work',
        title: 'Work',
        section: 'Socials',
        handler: () => {
          window.open("a.com", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
