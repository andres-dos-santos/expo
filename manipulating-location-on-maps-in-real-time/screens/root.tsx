import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location'
import { useCallback, useEffect, useRef, useState } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet'

import type { SearchedGeolocation } from '../types/geolocation'
import { FindSvg } from '../components/svgs/find'
import { ArrowRightSvg } from '../components/svgs/arrow-right'

const GEOCODE_API_KEY = '6626c3566bee8696923489suz4e8de9'

async function findLocation(location: string): Promise<SearchedGeolocation[]> {
  const response = await fetch(
    `https://geocode.maps.co/search?q=${location}&api_key=${GEOCODE_API_KEY}`,
  )

  if (!response.ok) {
    console.log(response.statusText, response.status)

    return null
  }

  return await response.json()
}

export function Root() {
  const bottomSheetRef = useRef<BottomSheet>(null)

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  const [location, setLocation] = useState<LocationObject | null>(null)

  const mapRef = useRef<MapView>(null)

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync()

    if (granted) {
      const currentPosition = await getCurrentPositionAsync()

      setLocation(currentPosition)
    }
  }

  useEffect(() => {
    requestLocationPermissions()
  }, [])

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response)

        mapRef.current?.animateCamera({
          // pitch: 70, puts the map in perspective
          center: response.coords,
        })
      },
    )
  }, [])

  function animateToRegion() {
    const GreenBayStadium = {
      latitude: 44.5013,
      longitude: -88.0622,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }

    mapRef.current.animateToRegion(GreenBayStadium)
  }

  function animateToCamera() {
    const GreenBayStadium = {
      latitude: 44.5013,
      longitude: -88.0622,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }

    mapRef.current.animateCamera(
      { center: GreenBayStadium, zoom: 10 },
      { duration: 3000 },
    )
  }

  const [value, onChangeText] = useState('')

  const [addresses, setAddresses] = useState<SearchedGeolocation[]>([])

  async function onSubmit() {
    const response = await findLocation(value)

    setAddresses(response)
  }

  return (
    <TouchableWithoutFeedback style={styles.container}>
      <>
        {location ? (
          <MapView
            style={[styles.map, StyleSheet.absoluteFill]}
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          />
        ) : null}

        {/** <Button title="Animate to region" onPress={animateToRegion} />
      <Button title="Animate camera" onPress={animateToCamera} /> */}

        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          handleIndicatorStyle={{ marginVertical: 20 }}
          backgroundStyle={{ borderRadius: 40 }}
          snapPoints={['20%', '30%']}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View style={styles.form}>
              <FindSvg />

              <BottomSheetTextInput
                style={styles.input}
                autoCapitalize="characters"
                placeholder="Discover the local climate"
                cursorColor="#0284c7"
                onChangeText={onChangeText}
                value={value}
              />

              <TouchableOpacity onPress={onSubmit} style={styles.button}>
                <ArrowRightSvg />
              </TouchableOpacity>
            </View>

            <BottomSheetFlatList
              data={addresses}
              renderItem={({ item }) => <Text>{item.display_name}</Text>}
            />
          </BottomSheetView>
        </BottomSheet>
      </>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  button: {
    height: 40,
    width: 40,
    backgroundColor: '#0284c7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontFamily: 'inter-medium',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  form: {
    height: 54,
    width: '85%',
    backgroundColor: '#f4f4f5',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    paddingLeft: 18,
  },
})
