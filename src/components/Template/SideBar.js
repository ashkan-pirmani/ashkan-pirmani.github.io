import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" />
      </Link>
      <header>
        <h2>Ashkan Pirmani</h2>
        <p>
          <a href="mailto:ashkan_pirmani@outlook.com">ashkan_pirmani [at] outlook [dot] com</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>Hi 👋🏻, I&apos;m Ashkan.</h2>
      <p>
        I&apos;m preparing for my defense of a double PhD (expected Nov 2024)
        <p>Leuven, Belgium 🇧🇪</p>
        <a
          href="https://www.esat.kuleuven.be/stadius/person.php?id=2346"
          target="_blank"
          rel="noopener noreferrer"
        >
          STADIUS - Department of Electrical Engineering (ESAT){' '} - KU Leuven
        </a>
        <br />
        <a
          href="https://www.uhasselt.be/en/instituten-en/biomed-en/immunology/biomedical-data-sciences/ashkan-pirmani"
          target="_blank"
          rel="noopener noreferrer"
        >
          Biomedical Data Science Research
        </a>
        {' '} - Uhasselt
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? (
            <Link to="/resume" className="button">
              Learn More
            </Link>
          ) : (
            <Link to="/about" className="button">
              About Me
            </Link>
          )}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        Template inspired by and used from
        &copy; Michael D&apos;Angelo.
      </p>
    </section>
  </section>
);

export default SideBar;
