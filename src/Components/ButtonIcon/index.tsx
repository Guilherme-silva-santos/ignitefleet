/* eslint-disable no-undef */
import { IconProps } from 'phosphor-react-native'
import { Container } from './styles'
import { TouchableOpacityProps } from 'react-native'
import { useTheme } from 'styled-components/native'

// forma de usar o icone de forma dinamica como props do componente
export type IconBoxProps = (porps: IconProps) => JSX.Element

type Props = TouchableOpacityProps & {
  icon: IconBoxProps
}

// fazendo icon: Icon, transforma o icon em um componente
export function ButtonIcon({ icon: Icon, ...rest }: Props) {
  const { COLORS } = useTheme()
  return (
    <Container activeOpacity={0.7} {...rest}>
      <Icon size={24} color={COLORS.BRAND_MID} />
    </Container>
  )
}
