import { TouchableOpacityProps } from 'react-native'
import { Check, ClockClockwise } from 'phosphor-react-native'

import { Container, Departure, Info, LincensePlate } from './styles'
import { useTheme } from 'styled-components/native'

export type HistoricCardProps = {
  id: string
  licensePlate: string
  created: string
  isSync: boolean
}

type Props = TouchableOpacityProps & {
  data: HistoricCardProps
}

export function HistoricCard({ data, ...rest }: Props) {
  const { COLORS } = useTheme()

  return (
    <Container {...rest}>
      <Info>
        <LincensePlate>{data.licensePlate}</LincensePlate>
        <Departure>{data.created}</Departure>
      </Info>

      {data.isSync ? (
        <Check size={24} color={COLORS.BRAND_LIGHT} />
      ) : (
        <ClockClockwise size={24} color={COLORS.GRAY_400} />
      )}
    </Container>
  )
}
