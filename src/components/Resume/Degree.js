import React from 'react';
import PropTypes from 'prop-types';

const Degree = ({ data }) => (
  <li>
    <article>
      <header>
        <h4>{data.degree}</h4>
        <p>
          <a href={data.link} target="_blank" rel="noopener noreferrer">{data.school}</a>, {data.yearStart} - {data.yearEnd}
        </p>
      </header>
      {data.thesis && <p>Thesis: <em>{data.thesis}</em></p>}
      {data.supervisor && <p>Under the supervision of <a href={data.supervisorLink} target="_blank" rel="noopener noreferrer">{data.supervisor}</a></p>}
      {data.points && <p>Points: {data.points}</p>}
    </article>
    <hr />
  </li>
);

Degree.propTypes = {
  data: PropTypes.shape({
    degree: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    school: PropTypes.string.isRequired,
    yearStart: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    yearEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    thesis: PropTypes.string,
    supervisor: PropTypes.string,
    supervisorLink: PropTypes.string,
    points: PropTypes.string,
  }).isRequired,
};

export default Degree;
