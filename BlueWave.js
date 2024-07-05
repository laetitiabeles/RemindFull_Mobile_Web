// BlueWave.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Dimensions } from 'react-native';

const BlueWave = ({ width, height }) => (
  <Svg
    height={200}
    width={Dimensions.get('screen').width}
    viewBox='0 0 1440 320'
  >
    <Path
      fill="#031D44" // Vous pouvez changer cette couleur pour personnaliser la vague
      d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,133.3C672,160,768,192,864,170.7C960,149,1056,75,1152,58.7C1248,43,1344,85,1392,106.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </Svg>
);

export default BlueWave;
