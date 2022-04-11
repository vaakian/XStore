import { unstable_batchedUpdates } from "react-dom"
import { Effect } from "./effect"

export function createDep(effects: Effect[] = []) {
  const dep = new Set(effects)
  return dep
}

export class Dep {
  effects: Set<Effect>
  constructor(effects: Effect[] = []) {
    this.effects = createDep(effects)
  }
  add(effect: Effect) {
    this.effects.add(effect)
  }
  notify(newValue: any) {
    unstable_batchedUpdates(() => {
      this.effects.forEach(effect => effect(newValue))
    })
  }
}