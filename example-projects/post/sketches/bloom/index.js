// POSTPROCESSING is a global variable available to Hedron sketches
const { EffectPass, BloomEffect, BlendFunction, KernelSize } = POSTPROCESSING

class Bloom {
  // Here we add our passes to the composer
  initiatePostProcessing (composer) {
    this.bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
      kernelSize: KernelSize.LARGE,
      useLuminanceFilter: true,
      luminanceThreshold: 0.825,
      luminanceSmoothing: 0.075,
      height: 480,
    })

    // Please refer to the postprocessing documentation to understand how these classes work
    // https://github.com/vanruesc/postprocessing
    const pass = new EffectPass(null, this.bloomEffect)
    composer.addPass(pass)

    // Return the pass that needs to be rendered to the screen
    return pass
  }

  // This method will be called every frame, just like the usual update method
  updatePostProcessing (p) {
    this.bloomEffect.blurPass.scale = p.scale
    this.bloomEffect.luminanceMaterial.threshold = p.lumThreshold
    this.bloomEffect.luminanceMaterial.smoothing = p.lumSmoothing
    this.bloomEffect.blendMode.opacity.value = p.opacity
  }
}

module.exports = Bloom

