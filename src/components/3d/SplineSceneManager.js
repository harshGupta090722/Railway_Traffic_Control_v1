// src/components/3d/SplineSceneManager.js
'use client';

export default class SplineSceneManager {
  constructor(splineApp) {
    this.splineApp = splineApp;
    this.trainObjects = new Map();
    this.signalObjects = new Map();
    this.trackObjects = new Map();
    this.conflictZones = new Map();
    
    this.initializeObjects();
  }

  // Initialize and cache 3D objects
  initializeObjects() {
    try {
      // Cache train objects
      const trainIds = ['EXP001', 'LOC002', 'FRG003', 'EXP004'];
      trainIds.forEach(id => {
        const trainObj = this.splineApp.findObjectByName(`train-${id}`);
        if (trainObj) {
          this.trainObjects.set(id, trainObj);
          
          // Initialize train properties
          trainObj.userData = {
            id: id,
            speed: 0,
            status: 'STOPPED',
            originalPosition: { ...trainObj.position }
          };
        }
      });

      // Cache signal objects
      trainIds.forEach(id => {
        const signalObj = this.splineApp.findObjectByName(`signal-${id}`);
        if (signalObj) {
          this.signalObjects.set(id, signalObj);
        }
      });

      // Cache track objects
      const trackNames = ['main-track', 'track-2', 'track-3'];
      trackNames.forEach(name => {
        const trackObj = this.splineApp.findObjectByName(name);
        if (trackObj) {
          this.trackObjects.set(name, trackObj);
        }
      });

      // Cache conflict zones
      const conflictNames = ['conflict-zone-alpha', 'conflict-zone-beta', 'conflict-zone-gamma'];
      conflictNames.forEach(name => {
        const zoneObj = this.splineApp.findObjectByName(name);
        if (zoneObj) {
          this.conflictZones.set(name, zoneObj);
          zoneObj.visible = false; // Initially hidden
        }
      });

      console.log('✅ Scene objects initialized:', {
        trains: this.trainObjects.size,
        signals: this.signalObjects.size,
        tracks: this.trackObjects.size,
        zones: this.conflictZones.size
      });

    } catch (error) {
      console.error('❌ Scene initialization error:', error);
    }
  }

  // Update entire scene based on scenario data
  updateScene(sceneData) {
    try {
      this.updateTrains(sceneData.trains || []);
      this.updateSignals(sceneData.trains || []);
      this.updateTracks(sceneData.scenario, sceneData.aiMode);
      this.updateConflictZones(sceneData.conflicts || []);
      this.updateLighting(sceneData.scenario);
      
      // Add special effects
      if (sceneData.aiMode && sceneData.scenario === 'optimized') {
        this.activateAIEffects();
      } else {
        this.deactivateAIEffects();
      }

    } catch (error) {
      console.error('❌ Scene update error:', error);
    }
  }

  // Update train positions and appearances
  updateTrains(trains) {
    trains.forEach(train => {
      const trainObj = this.trainObjects.get(train.id);
      if (!trainObj) return;

      try {
        // Smooth position updates
        if (train.position) {
          trainObj.position.x = train.position.x;
          trainObj.position.z = train.position.z;
          trainObj.position.y = train.position.y || 0;
        }

        // Update material based on train status
        const material = trainObj.material || trainObj.children[0]?.material;
        if (material) {
          if (train.emergency) {
            material.color.setHex(0xff0000);
            material.emissive.setHex(0x330000);
            material.emissiveIntensity = 0.5;
          } else if (train.optimized) {
            material.color.setHex(0x00ff44);
            material.emissive.setHex(0x003311);
            material.emissiveIntensity = 0.3;
          } else if (train.conflicted) {
            material.color.setHex(0xffaa00);
            material.emissive.setHex(0x332200);
            material.emissiveIntensity = 0.3;
          } else {
            const baseColor = parseInt(train.color?.replace('#', '0x') || '0x666666');
            material.color.setHex(baseColor);
            material.emissive.setHex(0x000000);
            material.emissiveIntensity = 0.0;
          }
        }

        // Update train scale based on speed (subtle effect)
        const speedScale = 1 + (train.speed / 1000);
        trainObj.scale.set(speedScale, 1, speedScale);

        // Store current data
        trainObj.userData = {
          ...trainObj.userData,
          ...train,
          lastUpdate: Date.now()
        };

      } catch (error) {
        console.warn(`Could not update train ${train.id}:`, error);
      }
    });
  }

  // Update signal lights
  updateSignals(trains) {
    trains.forEach(train => {
      const signalObj = this.signalObjects.get(train.id);
      if (!signalObj) return;

      try {
        let signalColor = 0x00ff00; // Default green
        let intensity = 1.0;

        if (train.emergency) {
          signalColor = 0xff0000; // Red for emergency
          intensity = 1.5;
        } else if (train.conflicted) {
          signalColor = 0xff0000; // Red for conflict
          intensity = 1.2;
        } else if (train.status === 'DELAYED') {
          signalColor = 0xffff00; // Yellow for delayed
          intensity = 1.0;
        } else if (train.optimized) {
          signalColor = 0x00ff00; // Bright green for optimized
          intensity = 1.3;
        }

        const material = signalObj.material || signalObj.children[0]?.material;
        if (material) {
          material.color.setHex(signalColor);
          material.emissive.setHex(signalColor);
          material.emissiveIntensity = intensity;
        }

        // Blinking effect for warnings
        if (train.emergency || train.conflicted) {
          this.addBlinkingEffect(signalObj, signalColor);
        }

      } catch (error) {
        console.warn(`Could not update signal for train ${train.id}:`, error);
      }
    });
  }

  // Update track colors based on scenario
  updateTracks(scenario, aiMode) {
    const trackColors = {
      normal: 0x666666,
      congestion: 0xffaa00,
      emergency: 0xff4444,
      optimized: aiMode ? 0x44ff44 : 0x666666
    };

    const trackColor = trackColors[scenario] || trackColors.normal;
    const emissiveIntensity = scenario === 'emergency' ? 0.2 : 
                            (scenario === 'optimized' && aiMode) ? 0.1 : 0;

    this.trackObjects.forEach((trackObj) => {
      try {
        const material = trackObj.material;
        if (material) {
          material.color.setHex(trackColor);
          material.emissive.setHex(trackColor);
          material.emissiveIntensity = emissiveIntensity;
        }
      } catch (error) {
        console.warn('Could not update track color:', error);
      }
    });
  }

  // Update conflict zones
  updateConflictZones(conflicts) {
    // Hide all zones first
    this.conflictZones.forEach(zone => {
      zone.visible = false;
    });

    // Show active conflict zones
    conflicts.forEach((conflict, index) => {
      const zoneName = ['conflict-zone-alpha', 'conflict-zone-beta', 'conflict-zone-gamma'][index];
      const zoneObj = this.conflictZones.get(zoneName);
      
      if (zoneObj) {
        try {
          zoneObj.visible = true;
          
          const material = zoneObj.material;
          if (material) {
            const conflictColor = conflict.severity === 'CRITICAL' ? 0xff0000 : 
                                 conflict.severity === 'HIGH' ? 0xff4444 :
                                 conflict.severity === 'MEDIUM' ? 0xffaa00 : 0xffff44;
            
            material.color.setHex(conflictColor);
            material.emissive.setHex(conflictColor);
            material.emissiveIntensity = 0.3;
            material.opacity = 0.6;
            material.transparent = true;
          }

          // Add pulsing effect for critical conflicts
          if (conflict.severity === 'CRITICAL') {
            this.addPulsingEffect(zoneObj);
          }

        } catch (error) {
          console.warn(`Could not update conflict zone ${zoneName}:`, error);
        }
      }
    });
  }

  // Update scene lighting
  updateLighting(scenario) {
    try {
      const ambientLight = this.splineApp.findObjectByName('AmbientLight') || 
                          this.splineApp.findObjectByName('ambientLight');
      const directionalLight = this.splineApp.findObjectByName('DirectionalLight') ||
                              this.splineApp.findObjectByName('directionalLight');

      if (ambientLight) {
        switch (scenario) {
          case 'normal':
            ambientLight.intensity = 0.6;
            ambientLight.color.setHex(0xffffff);
            break;
          case 'congestion':
            ambientLight.intensity = 0.5;
            ambientLight.color.setHex(0xffeeaa);
            break;
          case 'emergency':
            ambientLight.intensity = 0.3;
            ambientLight.color.setHex(0xff9999);
            break;
          case 'optimized':
            ambientLight.intensity = 0.8;
            ambientLight.color.setHex(0xeeffff);
            break;
        }
      }

      if (directionalLight) {
        directionalLight.intensity = scenario === 'emergency' ? 0.8 : 1.2;
      }

    } catch (error) {
      console.warn('Could not update lighting:', error);
    }
  }

  // Activate AI optimization visual effects
  activateAIEffects() {
    try {
      // Add particle systems to optimized trains
      this.trainObjects.forEach((trainObj, trainId) => {
        if (trainObj.userData.optimized) {
          const particles = this.splineApp.findObjectByName(`particles-${trainId}`);
          if (particles) {
            particles.visible = true;
          }
        }
      });

      // Add golden glow to tracks
      this.trackObjects.forEach(trackObj => {
        const material = trackObj.material;
        if (material) {
          material.emissive.setHex(0x444400);
          material.emissiveIntensity = 0.2;
        }
      });

    } catch (error) {
      console.warn('Could not activate AI effects:', error);
    }
  }

  // Deactivate AI effects
  deactivateAIEffects() {
    try {
      // Hide particle systems
      this.trainObjects.forEach((trainObj, trainId) => {
        const particles = this.splineApp.findObjectByName(`particles-${trainId}`);
        if (particles) {
          particles.visible = false;
        }
      });

    } catch (error) {
      console.warn('Could not deactivate AI effects:', error);
    }
  }

  // Camera control methods
  setCameraView(viewType) {
    try {
      const camera = this.splineApp.findObjectByName('Camera') ||
                    this.splineApp.findObjectByName('camera-main');

      if (!camera) return;

      const cameraPositions = {
        overview: { x: 0, y: 80, z: 120 },
        track: { x: -20, y: 8, z: 25 },
        station: { x: 50, y: 20, z: 40 },
        junction: { x: 0, y: 30, z: 30 }
      };

      const position = cameraPositions[viewType];
      if (position) {
        camera.position.set(position.x, position.y, position.z);
        camera.lookAt(0, 0, 0);
      }

    } catch (error) {
      console.warn('Could not set camera view:', error);
    }
  }

  // Focus camera on specific train
  focusOnTrain(trainObject) {
    try {
      const camera = this.splineApp.findObjectByName('Camera');
      if (camera && trainObject) {
        const trainPos = trainObject.position;
        camera.position.set(trainPos.x - 15, 15, trainPos.z + 15);
        camera.lookAt(trainPos.x, trainPos.y, trainPos.z);
      }
    } catch (error) {
      console.warn('Could not focus on train:', error);
    }
  }

  // Animate trains with smooth movement
  animateTrains(trains, speed = 1.0) {
    trains.forEach(train => {
      const trainObj = this.trainObjects.get(train.id);
      if (!trainObj || !train.position) return;

      try {
        // Smooth interpolation
        const currentX = trainObj.position.x;
        const targetX = train.position.x;
        const deltaX = (targetX - currentX) * 0.1 * speed;
        
        trainObj.position.x += deltaX;
        
        // Rotation based on movement direction
        if (Math.abs(deltaX) > 0.01) {
          trainObj.rotation.y = deltaX > 0 ? 0 : Math.PI;
        }

      } catch (error) {
        console.warn(`Could not animate train ${train.id}:`, error);
      }
    });
  }

  // Add blinking effect to objects
  addBlinkingEffect(object, color) {
    if (!object.blinkInterval) {
      object.blinkInterval = setInterval(() => {
        const material = object.material || object.children[0]?.material;
        if (material) {
          material.emissiveIntensity = material.emissiveIntensity > 0.5 ? 0.2 : 1.5;
        }
      }, 500);
    }
  }

  // Add pulsing effect to objects
  addPulsingEffect(object) {
    if (!object.pulseInterval) {
      let scale = 1;
      let growing = true;
      
      object.pulseInterval = setInterval(() => {
        if (growing) {
          scale += 0.05;
          if (scale >= 1.2) growing = false;
        } else {
          scale -= 0.05;
          if (scale <= 1.0) growing = true;
        }
        object.scale.set(scale, 1, scale);
      }, 100);
    }
  }

  // Cleanup method
  cleanup() {
    // Clear all intervals
    this.trainObjects.forEach(trainObj => {
      if (trainObj.blinkInterval) clearInterval(trainObj.blinkInterval);
    });
    
    this.signalObjects.forEach(signalObj => {
      if (signalObj.blinkInterval) clearInterval(signalObj.blinkInterval);
    });
    
    this.conflictZones.forEach(zoneObj => {
      if (zoneObj.pulseInterval) clearInterval(zoneObj.pulseInterval);
    });
  }
}
