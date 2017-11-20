import { getSketches } from '../externals/sketches'
import getSketchParams from '../selectors/getSketchParams'
import { availableModulesReplaceAll } from '../store/availableModules/actions'
import world from './world'

let store

class Engine {
  constructor () {
    this.allModules = {}
    this.modules = {}
    this.sketches = []
  }

  loadSketchModules (url) {
    this.sketchesFolder = url
    this.allModules = getSketches(url)

    Object.keys(this.allModules).forEach((key) => {
      const config = this.allModules[key].config
      this.modules[key] = config
    })
  }

  setCanvas (canvas) {
    this.canvas = canvas
  }

  addSketch (id, moduleId) {
    const meta = {
      sketchesFolder: `file://${this.sketchesFolder}`
    }

    const module = new this.allModules[moduleId].Module(world, meta)

    this.sketches.push({
      id,
      module
    })

    world.scene.add(module.root)
  }

  removeSketch (id) {
    this.sketches.forEach((sketch, index) => {
      if (sketch.id === id) {
        this.sketches.splice(index, 1)
        world.scene.remove(sketch.module.root)
      }
    })
  }

  fireShot (sketchId, method) {
    const state = store.getState()

    this.sketches.forEach((sketch) => {
      if (sketch.id === sketchId) {
        sketch.module[method](getSketchParams(state, sketch.id))
      }
    })
  }

  initiateSketches (sketches) {
    // Remove all sketches from world
    this.sketches.forEach((sketch, index) => {
      world.scene.remove(sketch.module.root)
    })
    this.sketches = []

    // Add new ones
    Object.keys(sketches).forEach((sketchId) => {
      const moduleId = sketches[sketchId].moduleId
      this.addSketch(sketchId, moduleId)
    })
  }

  run (injectedStore, stats) {
    let tick = 0
    store = injectedStore

    // Give store module params
    store.dispatch(availableModulesReplaceAll(this.modules))

    const loop = () => {
      stats.begin()

      const state = store.getState()
      const params = getSketchParams(state)

      this.sketches.forEach(sketch => sketch.module.update(
        params, tick
      ))

      world.render()

      stats.end()
      tick++
      requestAnimationFrame(loop)
    }
    loop()
  }
}

export default new Engine()
