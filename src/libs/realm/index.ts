/* eslint-disable no-undef */
import { createRealmContext } from '@realm/react'

import { Historic } from './schemas/Historic'

const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
  type: Realm.OpenRealmBehaviorType.OpenImmediately,
}

export const syncConfig: any = {
  // tipo de sincronização
  flexible: true,
  // para novos arquivos de sincronização do realm ele vai abrir imediatamente o banco de dados
  // usando a sincronização
  newRealmFileBehavior: realmAccessBehavior,
  // para arquivos já existentes o realm vai abrir imediatamente o banco de dados
  // usando a sincronização
  existingRealmFileBehavior: realmAccessBehavior,
}

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic],
  })
