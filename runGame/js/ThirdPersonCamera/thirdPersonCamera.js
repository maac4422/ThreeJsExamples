
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

export default class ThirdPersonCamera {
  constructor(params) {
    this.params = params
    this.camera = params.camera
    this.currentPosition = new THREE.Vector3()
    this.currentLookAt = new THREE.Vector3()
  }

  calculateIdealOffset(){
    const idealOffset = new THREE.Vector3(-15,20,-30)
    idealOffset.applyQuaternion(this.params.target.rotation)
    idealOffset.add(this.params.target.positionCharacter)
    return idealOffset
  }

  calculateIdealLookAt(){
    const idealLookAt = new THREE.Vector3(0,10,50)
    idealLookAt.applyQuaternion(this.params.target.rotation)
   // idealLookAt.add(this.params.target.positionCharacter)
    return idealLookAt
  }

  update(timeElapsed) {
    const idealOffset = this.calculateIdealOffset()
    const idealLookAt = this.calculateIdealLookAt()

    const t = 1.0 - Math.pow(0.001, timeElapsed)
    this.currentPosition.lerp(idealOffset, t)
    this.currentLookAt.lerp(idealLookAt, t)

    this.camera.position.copy(this.currentPosition)
    this.camera.lookAt(this.currentLookAt)
  }
}