import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';

const About = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/about.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  });

  const count = markdown
    .split(/\s+/)
    .map((s) => s.replace(/\W/g, ''))
    .filter((s) => s.length).length;

  return (
    <Main title="About" description="Learn about Ashkan Pirmani">
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                  src="https://ca.slack-edge.com/T0339NW49JB-U033HMBKK9C-3fd3ed0cf29d-512"
                  alt="Ashkan Pirmani"
                  style={{ width: '350px', height: '350px', borderRadius: '0%' }}
                />
              </div>
              <br />
              <Link to="/about">About Me</Link>
            </h2>
            <p>(in about {count} words) and 3-4 minutes to read</p>
          </div>
        </header>
        <Markdown>{markdown}</Markdown>
      </article>
    </Main>
  );
};

export default About;
