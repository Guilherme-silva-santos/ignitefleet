import { TouchableOpacity } from 'react-native'
import { useUser, useApp } from '@realm/react'

import { Container, Greeating, Message, Name, Picture } from './styles'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Power } from 'phosphor-react-native'
import theme from '../../theme'

export function HomeHeader() {
  const user = useUser()
  const app = useApp()
  const insets = useSafeAreaInsets()

  const paddingTop = insets.top + 32

  function handleLogout() {
    app.currentUser?.logOut()
  }

  return (
    <Container style={{ paddingTop }}>
      <Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="LEHLk~WB2yk8pyo0adR*.7kCMdnj"
      />
      <Greeating>
        <Message>Olá</Message>
        <Name>{user?.profile.name}</Name>
      </Greeating>
      <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
        <Power size={32} color={theme.COLORS.GRAY_700} />
      </TouchableOpacity>
    </Container>
  )
}
