import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js'

import BasicCharacterController from '../CharacterController/basicCharacterController.js'
import ThirdPersonCamera from '../ThirdPersonCamera/thirdPersonCamera.js'

export default class LoadModel {
  constructor(scene, camera, renderer) {
    this.init(scene, camera, renderer)
  }

  init(scene, camera, renderer) {
    this.scene = scene
    this.camera = camera
    this.mixers = []
    this.model = null
    this.previousRAF = null
    this.renderer = renderer
    this.raf()
  }

  loadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load(modelFile, (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });
      fbx.position.copy(offset);
      const params = {
        target: fbx,
        camera: this.camera,
      }
      this.controls = new BasicCharacterController(params)
      this.thirdPersonCamera = new ThirdPersonCamera({
        camera: this.camera,
        target: this.controls
      })

      const anim = new FBXLoader();
      anim.setPath(path);
      anim.load(animFile, (anim) => {
        const animation = new THREE.AnimationMixer(fbx);
        this.mixers.push(animation);
        const idle = animation.clipAction(anim.animations[0]);
        idle.clampWhenFinished = true
        idle.play();
      });
      this.scene.add(fbx);
      this.model = fbx
      this.setModelInfo(offset.x,offset.z)
    });
  }

  loadModelGLTF(path, modelFile, offset, scale = new THREE.Vector3(1, 1, 1)) {
    const loader = new GLTFLoader()
    const pathFile = path + modelFile
    loader.load(pathFile, (gltf) => {
      gltf.scene.scale.copy(scale)
      gltf.scene.position.copy(offset)

      this.scene.add(gltf.scene)
      this.model = gltf.scene
    })
  }

  raf() {
    requestAnimationFrame((t) => {
      
      if (this.previousRAF === null) {
        this.previousRAF = t
      }

      this.raf()

      this.renderer.render(this.scene, this.camera)
      this.step(t - this.previousRAF)
      this.previousRAF = t
    })
  }

  setModelInfo(positionX,positionZ) {
    this.modelInfo = {
      positionZ: positionZ,
      positionX: positionX,
      velocity: 0
    }
  }

  step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001
    if (this.controls) {
      if (this.mixers) {
        this.modelInfo.velocity = 0.3
        if(this.controls.move.forward){
          this.mixers.map(m => m.update(timeElapsedS))
          this.modelInfo.positionZ += this.modelInfo.velocity
          this.model.position.z = this.modelInfo.positionZ
        }
        if(this.controls.move.backward){
          this.mixers.map(m => m.update(timeElapsedS))
          this.modelInfo.positionZ -= this.modelInfo.velocity
          this.model.position.z = this.modelInfo.positionZ
        }
        if(this.controls.move.left){
          this.mixers.map(m => m.update(timeElapsedS))
          this.modelInfo.positionX += this.modelInfo.velocity
          this.model.position.x = this.modelInfo.positionX
        }
        if(this.controls.move.right){
          this.mixers.map(m => m.update(timeElapsedS))
          this.modelInfo.positionX -= this.modelInfo.velocity
          this.model.position.x = this.modelInfo.positionX
        }
        if(this.thirdPersonCamera) {
          this.thirdPersonCamera.update(timeElapsedS)
        }
      }
      this.controls.update(timeElapsedS)
    }
  }
}