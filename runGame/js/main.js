import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import LoadModel from './LoadModel/loadModel.js'
import Coin from './coin.js'

class RunGame {
  constructor() {
    this.init()
  }

  init() {
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 1000.0;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(25, 10, 25)

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    this.renderer.setClearColor(0xb7c3f3, 1)

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;

    this.scene.add(light);
    light = new THREE.AmbientLight(0xFFFFFF, 4.0);
    this.scene.add(light);

    // Center camera to focus character
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.update();


    //plane Scenario 
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x202020,
      }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
}



let app = null;

window.addEventListener('resize', () => {
  app.onWindowResize();
}, false);

window.addEventListener('DOMContentLoaded', () => {
  app = new RunGame();
  const zombie = new LoadModel(app.scene, app.camera, app.renderer)
  zombie.loadAnimatedModelAndPlay('./resources/zombie/', 'tPose.fbx', 'injuredRun.fbx', new THREE.Vector3(0, 0, 0))
  new Coin(app.scene, app.camera, app.renderer)
});

