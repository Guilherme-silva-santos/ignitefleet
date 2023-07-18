import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import theme from '../../theme'

/**
 * como a mensagem é sempre para aparecer no topo então
 * usa o demensions para para pegar as dimenções da tela
 */
const dimensions = Dimensions.get('window')

export const Container = styled.View`
  width: ${dimensions.width}px;

  position: absolute;
  // serve para que o elemento seja o primeiro da pilha
  z-index: 1;

  background-color: ${theme.COLORS.GRAY_500};
  padding-bottom: 5px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`
export const Title = styled.Text`
  color: ${theme.COLORS.GRAY_100};
  font-size: ${theme.FONT_SIZE.SM}px;
  font-family: ${theme.FONT_FAMILY.REGULAR};

  margin-left: 4px;
`
