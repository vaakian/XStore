
import React, { useEffect } from 'react'
import { xStore } from '../src'
import { IHTMLElement, Window } from 'happy-dom'
import { render } from 'react-dom'
import { vi } from 'vitest'
const store = xStore({ count: 1, increment: () => store.count++ })
const App: React.FC = () => {
  return (
    <div className='App'>
      <p id="count">{store.count}</p>
      <button id="increment1" onClick={() => store.count++}>increment</button>
      <button id="increment2" onClick={store.increment}>increment</button>
    </div>
  )
}
const { window: _, document } = new Window()

document.body.innerHTML = '<div id="app1"></div><div id="app2"></div>'
// @ts-ignore
render(<App />, document.getElementById('app1'))
const countEl = document.getElementById("count")
const incrementEl1 = document.getElementById("increment1") as IHTMLElement
const incrementEl2 = document.getElementById("increment2") as IHTMLElement

test('trigger arrow function', () => {
  incrementEl1.click()
  expect(countEl.textContent).toBe('' + store.count)


})

test('trigger increment event', () => {
  incrementEl2.click()
  expect(countEl.textContent).toBe('' + store.count)
})

test('set count outside of component', () => {
  store.count = 6666
  expect(countEl.textContent).toBe('6666')
})

const controlRender = vi.fn()
const boardRender = vi.fn()
const Control = () => {
  useEffect(controlRender, [])
  return (
    <div className="control">
      <button onClick={store.increment}>increment</button>
      <button onClick={() => store.count += 5}>+5</button>
    </div>
  )
}
const Board = () => {
  boardRender()
  return (
    <div className="control">
      <p>count {'=>'} {store.count}</p>
    </div>
  )
}
const App2 = () => {
  return <div>
    <Board />
    <Control />
  </div>
}
const root2 = document.getElementById('app2')
//@ts-ignore
render(<App2 />, root2)
test('update Board and DO NOT update Control', () => {
  store.count = 666
  expect(countEl.textContent).toBe('' + store.count)
  store.count = 777
  expect(countEl.textContent).toBe('' + store.count)
  store.count = 123
  expect(countEl.textContent).toBe('' + store.count)
  expect(controlRender).toBeCalledTimes(1)
  expect(boardRender).not.toBeCalledTimes(1)
})
