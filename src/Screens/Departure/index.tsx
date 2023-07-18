import { useRef, useState } from 'react'
import { ScrollView, TextInput, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { useUser } from '@realm/react'

import { Button } from '../../Components/Button'
import { Header } from '../../Components/Header'
import { LicensePlateInput } from '../../Components/LicensePlateInput'
import { TextAreaInput } from '../../Components/TextAreaInput'

import { Container, Content } from './styles'

import { licensePlateValidate } from '../../utils/licensePlateValidate'
import { useNavigation } from '@react-navigation/native'

export function Departure() {
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const realm = useRealm()
  const user = useUser()
  const { goBack } = useNavigation()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Placa invalida',
          'A placa é inválida. Por favor, informe a placa correta do veículo',
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Finalidade',
          'Por favor, informe a finalidade da utilização do veículo.',
        )
      }
      setIsRegistering(true)

      // dentro do write é passado o que será modificado dentro do banco de dados
      // com o write caso alguma transação falahar ele desfaz o que foi "feito"
      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toLocaleUpperCase(),
            description,
          }),
        )
      })
      Alert.alert('Saída', 'Saída do vaículo registrada com sucesso!')
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível registrar a saída do veículo.')
      setIsRegistering(false)
    }
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus}
              // quando for cricado no check do teclado ele pega a referencia do outro input e joga para ele
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />
            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              // para que o botão do textarea não quebre a linha e sim faça o submit do form
              blurOnSubmit
              onChangeText={setDescription}
            />
            <Button
              title="Registrar saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  )
}
