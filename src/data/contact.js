import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faGoogleScholar } from '@fortawesome/free-brands-svg-icons/faGoogleScholar';
import { faDocker } from '@fortawesome/free-brands-svg-icons/faDocker';
import { faResearchgate } from '@fortawesome/free-brands-svg-icons/faResearchgate';
import { faOrcid } from '@fortawesome/free-brands-svg-icons/faOrcid';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

// See https://fontawesome.com/icons?d=gallery&s=brands,regular&m=free
// to add other icons.

const data = [
  {
    link: 'https://github.com/ashkan-pirmani',
    label: 'Github',
    icon: faGithub,
  },
  {
    link: 'https://www.linkedin.com/in/ashkan-pirmani-3b8a8896/',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://scholar.google.com/citations?user=RC2DM7kAAAAJ&hl=en',
    label: 'Google Scholar',
    icon: faGoogleScholar,
  },
  {
    link: 'https://www.researchgate.net/profile/Ashkan-Pirmani',
    label: 'Researchgate',
    icon: faResearchgate,
  },
  {
    link: 'https://orcid.org/0000-0003-4549-1002',
    label: 'ORCiD',
    icon: faOrcid,
  },
  {
    link: 'https://hub.docker.com/u/ashkanpirmani',
    label: 'Docker',
    icon: faDocker,
  },
  {
    link: 'https://twitter.com/dangelosaurus',
    label: 'Twitter',
    icon: faTwitter,
  },
  {
    link: 'mailto:michael.l.dangelo@gmail.com',
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
