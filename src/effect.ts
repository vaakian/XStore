// export class Effect {
//   constructor(public fn: (...args: any[]) => void) {
//   }
//   run() {
//     try {
//       this.fn()
//     } catch {
//     }
//   }
// }

export type Effect = (...args: any[]) => any