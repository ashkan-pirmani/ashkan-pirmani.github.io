/**
 * @typedef {Object} Position
 * Conforms to https://jsonresume.org/schema/
 *
 * @property {string} name - Name of the company
 * @property {string} position - Position title
 * @property {string} url - Company website
 * @property {string} startDate - Start date of the position in YYYY-MM-DD format
 * @property {string|undefined} endDate - End date of the position in YYYY-MM-DD format.
 * If undefined, the position is still active.
 * @property {string|undefined} summary - html/markdown summary of the position
 * @property {string[]} highlights - plain text highlights of the position (bulleted list)
 */
const work = [
  {
    name: 'Global Data Sharing Initiative',
    position: 'Lead Architect',
    url: 'https://doi.org/10.1212/NXI.0000000000200021',
    startDate: '2022-06-01',
    summary: 'Lead Architecture aiming to scale up COVID-19 data collection efforts.',
    highlights: [
      'Updated Results of the COVID-19 in MS Global Data Sharing Initiative Anti-CD20 With COVID-19: [Link](https://doi.org/10.1212/NXI.0000000000200021)',
      'A Federated 3-Layer Data Analysis Pipeline to Scale Up Multiple Sclerosis Research: [Link](https://medinform.jmir.org/2023/1/e48030/)',
    ],
  },
  {
    name: 'Project ATHENA',
    position: 'Data Scientist',
    url: 'https://ebooks.iospress.nl/doi/10.3233/SHTI220601',
    startDate: 'Ongoing',
    summary: 'Aiming to enhance personalized medicine with secure collaboration.',
    highlights: [
      'Augmenting Therapeutic Effectiveness through Novel Analytics: Machine learning: [Link](https://ebooks.iospress.nl/doi/10.3233/SHTI220601)',
    ],
  },
  {
    name: 'PhD Research',
    position: 'Researcher',
    url: 'https://ubnl.space/',
    startDate: '2020-01-01',
    summary: 'In the rapidly evolving landscape of healthcare research, the need for accessing substantial and diverse data sets has never been greater. While the proliferation of Real-World Data (RWD) offers unprecedented opportunities for medical breakthroughs, barriers such as data fragmentation, ethical considerations, and complex regulatory landscapes often impede seamless data access and collaboration. This PhD research aims to navigate these challenges by tackling different aspects like contributing and operationalizing existing projects, developing robust frameworks, and executing use cases. These approaches not only broaden the horizon of multi-stakeholder collaboration in clinical research but also streamline the intricacies of executing innovative approaches like federated learning, thereby stepping forward to make the use of RWD more accessible and effective for real-world applications.',
    highlights: [
      'Multiple Sclerosis & COVID-19 Global Data Sharing Initiative: A federated architecture was designed and implemented to address challenges in investigating multiple sclerosis and COVID-19. This architecture facilitated the seamless exchange of data while adhering to stringent privacy norms. Its effectiveness was demonstrated in the COVID-19 and MS Global Data Sharing Initiative, contributing to the assembly of the largest dataset of people with MS infected with COVID-19.',
      'Federated Learning for Everyone (FL4E): The FL4E framework was presented as a versatile and accessible ecosystem that simplified the intricacies of federated learning. This framework enabled multi-stakeholder clinical research collaboration and demonstrated efficacy through rigorous testing on real-world healthcare datasets. The framework’s innovative ‘degree of federation’ feature was noted for its ability to balance centralized and federated learning approaches.',
      'Leveraging Federated Learning for Multiple Sclerosis: An Empirical Examination of Using Real-World Data which aim is assess to different research question using FL: The research aims to address key questions that assess the challenges and effectiveness of Federated Learning in real-world scenarios. Heterogeneity in clinical practices and patient populations is analyzed, and the feasibility of different federated setups is assessed. Ideal configurations for conducting Federated Learning research are explored, seeking to identify the most effective federated methods.',
    ],
  },
  {
    name: 'Ashkan’s Subprojects',
    position: 'Contributor',
    url: 'https://ubnl.space/',
    startDate: '2019-01-01',
    summary: 'Ashkan is involved in the following subprojects:',
    highlights: [
      'POC1 of the Flanders AI Research Project (2019-2023)',
      'Federated infrastructure used in the COVID-19 in MS Global Data Sharing Initiative (GDSI) (= MSDA project)',
      'POC4 of the Flanders AI Research Project (2019-2023)',
      'Leveraging Federated Learning for MS: an empirical examination of using RWD',
      'MS Data Alliance: COVID-19 & MS Global Data Sharing Initiative (GDSI)',
      'MSDA Catalogue',
      'Automated Catalogue',
      'ELIXIR: Federated Learning for Everyone (FL4E)',
    ],
  },
];

export default work;
