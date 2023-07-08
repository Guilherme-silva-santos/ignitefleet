/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

import { Container, Slogan, Title } from './styles'

import backgroundImg from '../../assets/background.png'
import { Button } from '../../Components/Button'
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { useEffect, useState } from 'react'

import { Realm, useApp } from '@realm/react'

import { Alert } from 'react-native'

// cuida da interface de autenticação que vai abrir fora do app
WebBrowser.maybeCompleteAuthSession()

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const app = useApp()

  // hook que define as chaves e os escopos que devem ser acessados
  const [_, response, googleSignIng] = Google.useAuthRequest({
    /**
     * acessa as informações retornadas,a primeira é a requisição que não sera necessaria po isso o _
     * segundo a reposta que retorna do array e o terceiro o metodo que inicia a autenticação
     */
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
  })

  function handleGoogleSignIn() {
    setIsAuthenticating(true)

    googleSignIng().then((response) => {
      // pega o metodo que inicia autenticação para lidar com a resposta
      // aguarda a resposta e se a resposta for diferente de sucesso desativa o loading
      if (response?.type !== 'success') {
        setIsAuthenticating(false)
      }
    })
  }

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.authentication?.idToken) {
       const credentials = Realm.Credentials.jwt(response.authentication.idToken)
       app.logIn(credentials).catch((error) =>{
        console.log(error)
        Alert.alert('Entrar', 'Não foi possivel conectar-se')
        setIsAuthenticating(false)
        
       })
       
      } else {
        Alert.alert('Entrar', 'Não foi possivel conectar-se')
        setIsAuthenticating(false)
      }
    }
  }, [response])

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>
      <Slogan>Gestão de uso de veículos</Slogan>
      <Button
        title="Entrar com Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </Container>
  )
}
