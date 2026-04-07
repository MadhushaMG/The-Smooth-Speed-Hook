
---
### Usage in React Native - sample
```tsx

import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNearuSocket } from './hooks/useNearuSocket';

const TrackingScreen = () => {
  const circleId = "6d13aaac-5e46-438a-8ee1-2b040c29b440";
  const userId = "62072bac-4eea-4080-9089-1edd512e9a2e";

  const { members, isConnected, emitLocation } = useNearuSocket(circleId, userId);

 
  const handleUpdate = () => {
    emitLocation({
      latitude: 6.9271,
      longitude: 79.8612,
      speed: 45,
      battery: "95%",
      name: "Madhusha Mobile"
    });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f0f0f0' }}>
      <Text>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</Text>
      
      <Button title="Send My Location" onPress={handleUpdate} />

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Circle Members:</Text>
      {members.map(m => (
        <View key={m.id} style={{ padding: 10, backgroundColor: 'white', marginVertical: 5 }}>
          <Text>{m.name} - {m.speed} km/h (🔋 {m.battery})</Text>
          <Text style={{ fontSize: 10 }}>📍 {m.locationText}</Text>
        </View>
      ))}
    </View>
  );
};
