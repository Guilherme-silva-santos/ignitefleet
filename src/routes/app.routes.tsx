import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home } from '../Screens/Home'
import { Departure } from '../Screens/Departure'
import { Arrival } from '../Screens/Arrival'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="departure" component={Departure} />
      <Screen name="arrival" component={Arrival} />
    </Navigator>
  )
}
