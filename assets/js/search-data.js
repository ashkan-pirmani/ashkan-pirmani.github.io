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
        },{id: "nav-projects",
          title: "projects",
          description: "A collection of my cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
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
        },{id: "news-mie-2024-️-when-august-2024-where-athens-greece-what-presented-a-paper-titled-unlocking-the-power-of-real-world-data-a-framework-for-sustainable-healthcare-focus-proposed-a-practical-framework-to-leverage-real-world-data-for-achieving-sustainable-healthcare-systems-and-driving-impactful-insights",
          title: '💡 MIE 2024 🗓️ When: August 2024 📍 Where: Athens, Greece 🇬🇷 🎤...',
          description: "",
          section: "News",},{id: "news-ectrims-2024-️-when-september-2024-where-copenhagen-denmark-what-presented-an-abstract-and-poster-titled-transforming-multiple-sclerosis-research-advancing-disability-progression-insights-through-practical-and-precise-federated-learning-using-real-world-data-focus-showcased-the-potential-of-federated-learning-for-advancing-insights-into-disability-progression-in-multiple-sclerosis-using-real-world-data",
          title: '🧠 ECTRIMS 2024 🗓️ When: September 2024 📍 Where: Copenhagen, Denmark 🇩🇰 🎤...',
          description: "",
          section: "News",},{id: "news-dr-doctor-squared-yes-you-heard-it-right-click-on-me-for-more-detailed-info",
          title: '🎓 Dr² (Doctor Squared)- Yes, you heard it right! Click on me for...',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_1/";
            },},{id: "projects-the-journey-of-data-within-a-global-data-sharing-initiative",
          title: 'The Journey of Data Within a Global Data Sharing Initiative',
          description: "A human story of collaboration, innovation, and the magic of federated data analysis.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-fl4e-a-federated-learning-for-everyone-revolution-in-clinical-research",
          title: 'FL4E - A Federated Learning For Everyone Revolution in Clinical Research',
          description: "How FL4E is making clinical research more collaborative, inclusive, and privacy-focused.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/ashkan-pirmani", "_blank");
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
