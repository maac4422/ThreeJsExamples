import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

import BasicCharacterController from '../CharacterController/basicCharacterController.js'

export default class LoadModel {
  constructor(scene,camera,renderer) {
    this.init(scene,camera,renderer)
  }

  init(scene,camera,renderer) {
    this.scene = scene
    this.camera = camera
    this.mixers = [];
    this.previousRAF = null;
    this.renderer = renderer

    
    this.loadAnimatedModel()
    this.raf()
  }

  loadAnimatedModel() {
    const loader = new FBXLoader();
    loader.setPath('./resources/zombie/');
    loader.load('tPose.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      const params = {
        target: fbx,
        camera: this.camera,
      }
      this.controls = new BasicCharacterController(params);
      const anim = new FBXLoader();
      anim.setPath('./resources/zombie/');
      anim.load('injuredRun.fbx', (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this.mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
      });
      this.scene.add(fbx);
    });
  }

  loadAnimatedModelAndPlay() {

  }

  loadModel() {

  }

  raf() {
    
    requestAnimationFrame((t) => {
      if (this.previousRAF === null) {
        this.previousRAF = t;
      }

      this.raf();

      this.renderer.render(this.scene, this.camera);
      this.step(t - this.previousRAF);
      this.previousRAF = t;
    });
    
  }

  step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this.mixers) {
      this.mixers.map(m => m.update(timeElapsedS));
    }

    if (this.controls) {
      this.controls.update(timeElapsedS);
    }
  }
}