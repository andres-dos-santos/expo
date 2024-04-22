import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Root } from './screens/root'
import { useFonts } from 'expo-font'

export default function App() {
  const [fontsLoaded] = useFonts({
    // 'urbanist-regular': require('./assets/fonts/urbanist/Urbanist-Regular.ttf'),
    // 'urbanist-medium': require('./assets/fonts/urbanist/Urbanist-Medium.ttf'),
    // 'urbanist-semibold': require('./assets/fonts/urbanist/Urbanist-SemiBold.ttf'),
    'inter-regular': require('./assets/fonts/inter/Inter-Regular.ttf'),
    'inter-medium': require('./assets/fonts/inter/Inter-Medium.ttf'),
    'inter-semibold': require('./assets/fonts/inter/Inter-SemiBold.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Root />
    </GestureHandlerRootView>
  )
}
