/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage'

// chave
const STORAGE_ASYNC_KEY = '@ignitefleet:last_sync'

// metodo que salva a ultima sincronização 
export async function saveLastSyncTimestamp() {
  // pega a data atual que no caso servira para dizer quando foi a ultima sincronização 
  const timestamp = new Date().getTime()
                            // chave            // produto
  await AsyncStorage.setItem(STORAGE_ASYNC_KEY, timestamp.toString())

  return timestamp
}

// metodo para obter quando foi a ultima sincronização 
export async function getLastAsyncTimestamp(){
    const response = await AsyncStorage.getItem(STORAGE_ASYNC_KEY)

    return Number(response)
}
