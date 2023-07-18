/* eslint-disable react/display-name */
import { useTheme } from 'styled-components/native'
import { Container, Input, Label } from './styles'
import { TextInput, TextInputProps } from 'react-native'
import { Content } from '../../Screens/Home/styles'
import { forwardRef } from 'react'

type Props = TextInputProps & {
  label: string
}

const LicensePlateInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    const { COLORS } = useTheme()
    return (
      <Container>
        <Label>{label}</Label>
        <Content>
          <Input
            maxLength={7}
            autoCapitalize="characters"
            placeholderTextColor={COLORS.GRAY_400}
            {...rest}
          />
        </Content>
      </Container>
    )
  },
)

export { LicensePlateInput }
