import { useEffect, useState } from 'react'
import { Dep } from './dep'
type KeyType = string | symbol
export function xStore<T extends Record<KeyType, unknown>>(initialState: T): T {
  const dep: Record<KeyType, Dep> = {}
  const store = new Proxy(initialState, {
    get(target, key) {
      const value = Reflect.get(target, key)
      if (typeof value === 'function') {
        // function should NOT cause any effect
      }
      else if (!Reflect.has(target, key)) {
        // accessing a property of the store in which it does not exists.
        console.warn(`trying to access a property of the store in which it does not exists.\n` +
          `reading property '${key.toString()}' from the store.\n`)
      }
      else {
        track(key)
      }
      return value
    },
    set(target, key, value) {
      if (Reflect.get(target, key) === value) return true
      Reflect.set(target, key, value)
      // setter causes the corresponding `effect`
      trigger(key, value)
      return true
    }
  })
  return store


  function trigger(key: KeyType, value: any) {
    dep[key]?.notify(value)
  }

  function track(key: KeyType) {
    try {
      // collect the effect(`updater` of the corresponding component)
      // it will also trigger getter first when using `store.count++`
      // but it's a invalid hook call and React will throw a Error
      const effect = useUpdate()
      if (!dep[key]) {
        dep[key] = new Dep()
      }
      dep[key].add(effect)
      useEffect(() => {
        return () => {
          delete dep[key]
        }
      }, [])
    }
    catch (err) {
      // console.warn('using ++ operation\n' +
      // 'or you have GET a property before SET.\n')
    }
  }
}

export function useUpdate() {
  return useState()[1]
}