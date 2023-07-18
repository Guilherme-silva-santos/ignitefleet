/* eslint-disable react/display-name */
import { TextInput, TextInputProps } from 'react-native'
import { Container, Input } from './styles'
import { Label } from '../LicensePlateInput/styles'
import { useTheme } from 'styled-components/native'
import { forwardRef } from 'react'

type Props = TextInputProps & {
  label: string
}

const TextAreaInput = forwardRef<TextInput, Props>(
  // com o forwardRef recupera a referencia passada pelo componente pai
  // o departure
  ({ label, ...rest }, ref) => {
    const { COLORS } = useTheme()
    return (
      <Container>
        <Label>{label}</Label>
        <Input
          ref={ref}
          // e aqui passa a referencia do componente
          placeholderTextColor={COLORS.GRAY_400}
          multiline
          autoCapitalize="sentences"
          {...rest}
        />
      </Container>
    )
  },
)

export { TextAreaInput }
