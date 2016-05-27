'use strict';

import React from 'react';

require('styles/App.css');

class ImgFigureComponent extends React.Component {
  render() {
    return (
      <figure>
          <img/>
          <figcaption>
              <h2></h2>
          </figcaption>
      </figure>
    );
  }
}

ImgFigureComponent.displayName = 'ImgFigureComponent';

// Uncomment properties you need
// ImgFigureComponent.propTypes = {};
// ImgFigureComponent.defaultProps = {};

export default ImgFigureComponent;
