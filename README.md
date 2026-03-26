# The-Smooth-Speed-Hook
The Smooth Speed Hook | Madhusha M. Gunasekara


Add to hook folder (useSomoothSpeed.ts)



web / desktop (electrone / react)


import { useSmoothSpeed } from './hooks/useSmoothSpeed';

const SpeedMeter = ({ apiSpeed }: { apiSpeed: number }) => {

  const displaySpeed = useSmoothSpeed(apiSpeed, 1500); 
  return (
    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
      {displaySpeed} <span style={{ fontSize: '18px' }}>km/h</span>
    </div>
  );
};




mobile (react native)


import React from 'react';
import { Text, View } from 'react-native';
import { useSmoothSpeed } from './hooks/useSmoothSpeed';

const MobileSpeedMeter = ({ apiSpeed }: { apiSpeed: number }) => {
  const displaySpeed = useSmoothSpeed(apiSpeed, 1200);

  return (
    <View>
      <Text style={{ fontSize: 40, color: '#333' }}>{displaySpeed} km/h</Text>
    </View>
  );
};
