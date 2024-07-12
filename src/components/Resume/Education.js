import React from 'react';
import PropTypes from 'prop-types';

import Degree from './Degree';

const Education = ({ data }) => (
  <div>
    <div className="link-to" id="education" />
    <div>
      <h3>Education</h3>
    </div>
    <ul>
      {data.map((degree) => (
        <Degree data={degree} key={degree.school + degree.degree} />
      ))}
    </ul>
  </div>
);

Education.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      school: PropTypes.string.isRequired,
      degree: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      yearStart: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      yearEnd: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      thesis: PropTypes.string,
      supervisor: PropTypes.string,
      supervisorLink: PropTypes.string,
      points: PropTypes.string,
    }),
  ),
};

Education.defaultProps = {
  data: [],
};

export default Education;
