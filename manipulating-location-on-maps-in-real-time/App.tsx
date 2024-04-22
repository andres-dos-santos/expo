import { StyleSheet, View } from 'react-native';
import { 
  requestForegroundPermissionsAsync, 
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import MapView from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();

      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
    }, (response) => {
      setLocation(response);

      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords,
      })
    })
  }, [])

  return (
    <View style={styles.container}>
      {location ? 
        <MapView 
          style={styles.map} 
          ref={mapRef}
          initialRegion={{ 
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }} 
        /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
});
