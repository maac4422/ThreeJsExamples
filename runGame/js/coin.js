import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import LoadModel from './LoadModel/loadModel.js'

export default class Coin {
    constructor(scene, camera, renderer) {
        this.init(scene, camera, renderer)
    }

    init(scene, camera, renderer){
        const loadModel = new LoadModel(scene, camera, renderer)
        this.coin = loadModel.loadModelGLTF('./resources/coins/','scene.gltf', new THREE.Vector3(0, 10, 10), new THREE.Vector3(10, 10, 10) )

        setTimeout(()=> {
            loadModel.model.rotation.x = 1.55
        },500)
        
    }
}