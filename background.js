import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.122/build/three.module.js';

import {math} from './math.js';

import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const background = (() => {

  class BackgroundCloud {
    constructor(params) {
      this.params_ = params;
      this.position_ = new THREE.Vector3();
      this.quaternion_ = new THREE.Quaternion();
      this.scale_ = 1.0;
      this.mesh_ = null;

      this.LoadModel_();
    }

    LoadModel_() {
      const loader = new GLTFLoader();
      loader.setPath('./resources/Clouds/GLTF/');
      loader.load('Cloud' + math.rand_int(1, 3) + '.glb', (glb) => {
        this.mesh_ = glb.scene;
        this.params_.scene.add(this.mesh_);

        this.position_.x = math.rand_range(0, 2000);
        this.position_.y = math.rand_range(100, 200);
        this.position_.z = math.rand_range(500, -1000);
        this.scale_ = math.rand_range(10, 20);

        const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), math.rand_range(0, 360));
        this.quaternion_.copy(q);

        this.mesh_.traverse(c => {
          if (c.geometry) {
            c.geometry.computeBoundingBox();
          }

          let materials = c.material;
          if (!(c.material instanceof Array)) {
            materials = [c.material];
          }
  
          for (let m of materials) {
            if (m) {
              m.specular = new THREE.Color(0x000000);
              m.emissive = new THREE.Color(0xC0C0C0);
            }
          }    
          c.castShadow = true;
          c.receiveShadow = true;
        });
      });
    }

    Update(timeElapsed) {
      if (!this.mesh_) {
        return;
      }

      this.position_.x -= timeElapsed * 10;
      if (this.position_.x < -100) {
        this.position_.x = math.rand_range(2000, 3000);
      }

      this.mesh_.position.copy(this.position_);
      this.mesh_.quaternion.copy(this.quaternion_);
      this.mesh_.scale.setScalar(this.scale_);
    }
  };

  class BackgroundCrap {
    constructor(params) {
      this.params_ = params;
      this.position_ = new THREE.Vector3();
      this.quaternion_ = new THREE.Quaternion();
      this.scale_ = 1.0;
      this.mesh_ = null;

      this.LoadModel_();
    }

    LoadModel_() {
      const assets = [
          ['SmallPalmTree.glb', 'PalmTree.png', 3],
          ['BigPalmTree.glb', 'PalmTree.png', 5],
          ['Skull.glb', 'Ground.png', 1],
          ['Scorpion.glb', 'Scorpion.png', 1],
          ['Pyramid.glb', 'Ground.png', 40],
          ['Monument.glb', 'Ground.png', 10],
          ['Cactus1.glb', 'Ground.png', 5],
          ['Cactus2.glb', 'Ground.png', 5],
          ['Cactus3.glb', 'Ground.png', 5],
      ];
      const [asset, textureName, scale] = assets[math.rand_int(0, assets.length - 1)];

      const texLoader = new THREE.TextureLoader();
      const texture = texLoader.load('./resources/DesertPack/Blend/Textures/' + textureName);
      texture.encoding = THREE.sRGBEncoding;

      const loader = new GLTFLoader();
      loader.setPath('./resources/DesertPack/GLTF/');
      loader.load(asset, (glb) => {
        this.mesh_ = glb.scene;
        this.params_.scene.add(this.mesh_);

        this.position_.x = math.rand_range(0, 2000);
        this.position_.z = math.rand_range(500, -1000);
        this.scale_ = scale;

        const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), math.rand_range(0, 360));
        this.quaternion_.copy(q);

        this.mesh_.traverse(c => {
          let materials = c.material;
          if (!(c.material instanceof Array)) {
            materials = [c.material];
          }
  
          for (let m of materials) {
            if (m) {
              if (texture) {
                m.map = texture;
              }
              m.specular = new THREE.Color(0x000000);
            }
          }    
          c.castShadow = true;
          c.receiveShadow = true;
        });
      });
    }

    Update(timeElapsed) {
      if (!this.mesh_) {
        return;
      }

      this.position_.x -= timeElapsed * 10;
      if (this.position_.x < -100) {
        this.position_.x = math.rand_range(2000, 3000);
      }

      this.mesh_.position.copy(this.position_);
      this.mesh_.quaternion.copy(this.quaternion_);
      this.mesh_.scale.setScalar(this.scale_);
    }
  };

  class Background {
    constructor(params) {
      this.params_ = params;
      this.clouds_ = [];
      this.crap_ = [];

      this.SpawnClouds_();
      this.SpawnCrap_();
    }

    SpawnClouds_() {
      for (let i = 0; i < 25; ++i) {
        const cloud = new BackgroundCloud(this.params_);

        this.clouds_.push(cloud);
      }
    }

    SpawnCrap_() {
      for (let i = 0; i < 50; ++i) {
        const crap = new BackgroundCrap(this.params_);

        this.crap_.push(crap);
      }
    }

    Update(timeElapsed) {
      for (let c of this.clouds_) {
        c.Update(timeElapsed);
      }
      for (let c of this.crap_) {
        c.Update(timeElapsed);
      }
    }
  }

  return {
      Background: Background,
  };
})();