/* eslint-disable no-undef */
/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Alert, FlatList } from 'react-native'

import Toast from 'react-native-toast-message'

import dayjs from 'dayjs'

import { useQuery, useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import {
  getLastAsyncTimestamp,
  saveLastSyncTimestamp,
} from '../../libs/asyncStorage/syncStorage'

import { CarStatus } from '../../Components/CarStatus'
import { HomeHeader } from '../../Components/HomeHeader'
import { HistoricCard, HistoricCardProps } from '../../Components/HistoricCard'

import { Container, Content, Label, Title } from './styles'
import { useUser } from '@realm/react'
import { TopMessage } from '../../Components/TopMessage'
import { CloudArrowUp } from 'phosphor-react-native'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>()
  const [percentageToSync, isPercentageToSync] = useState<String | null>(null)

  const { navigate } = useNavigation()

  // o usequery é usado para fazer consultas dentro do banco, passa para ele onde será feita
  // essa consulta nesse caso no Historic
  const historic = useQuery(Historic)
  const realm = useRealm()
  const user = useUser()

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      // se houver um veivulo em uso leva para interface de registrar chegada
      // senão para interface de registrar saida
      navigate('arrival', { id: vehicleInUse?._id.toString() })
    } else {
      navigate('departure')
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0]
      setVehicleInUse(vehicle)
    } catch (error) {
      Alert.alert(
        'Veículo em uso',
        'Não foi possível carregar o veículo em uso',
      )
    }
  }

  async function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status='arrival' SORT(created_at DESC)",
      )
      const lastSync = await getLastAsyncTimestamp()

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at!.getTime(),
          created: dayjs(item.created_at).format(
            '[Saída em] DD/MM/YYYY [às] HH:mm',
          ),
        }
      })
      setVehicleHistoric(formattedHistoric)
    } catch (error) {
      console.log(error)
      Alert.alert('Histórico', 'Não foi possível carregar o histórico.')
    }
  }

  function handleHistoricDetails(id: string) {
    navigate('arrival', { id })
  }

  async function progressNotification(
    transferred: number,
    transferable: number,
  ) {
    const percentage = (transferred / transferable) * 100

    if (percentage === 100) {
      // se a porcentagem for igual a 100
      // significa que ja foi sincronizado
      // e enetão salva a data e a hora atual como sendo o ultimo momento de sincronização
      await saveLastSyncTimestamp()
      await fetchHistoric()
      isPercentageToSync(null)
      Toast.show({
        type: 'info',
        text1: 'Todos os dados estão sincronizados',
      })
    }

    if (percentage < 100) {
      isPercentageToSync(` ${percentage.toFixed(0)} % sincronizado`)
    }
  }

  useEffect(() => {
    fetchVehicleInUse()
  }, [])

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())
    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse)
      }
    }
  }, [])

  useEffect(() => {
    fetchHistoric()
  }, [historic])

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm
        .objects('Historic')
        .filtered(`user_id = '${user!.id}'`)
      mutableSubs.add(historicByUserQuery, { name: 'hitoric_by_user' })
    })
  }, [realm])

  useEffect(() => {
    // obtenddo a informação de quantos dados precisam ser envidos ainda
    const syncSession = realm.syncSession

    if (!syncSession) {
      return
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification,
    )
    return () => syncSession.removeProgressNotification(progressNotification)
  }, [])

  return (
    <Container>
      {percentageToSync && (
        <TopMessage title={percentageToSync} icon={CloudArrowUp} />
      )}

      <HomeHeader />
      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />
        <Title>Histórico</Title>
        <FlatList
          data={vehicleHistoric}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>Nenhum veículo utilizado.</Label>}
        />
      </Content>
    </Container>
  )
}
