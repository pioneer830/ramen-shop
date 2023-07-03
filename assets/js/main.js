import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Reflector } from 'three/addons/objects/Reflector.js';


let parent;

// create new scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#000");

document.body.appendChild(renderer.domElement);

// ambient light
var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// point light
var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

// orbitControl
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-30, 15, 10);
// camera.lookAt(0.5, 0.5, 0.5);

controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;
controls.zoomSpeed = 1.5;
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = true;
controls.minDistance = 8;
controls.maxDistance = 20;

controls.maxPolarAngle = Math.PI / 2.1;
controls.minPolarAngle = Math.PI / 6;

// controls.target.set(0, 0.1, 0);
controls.update();

// postprocessing
const renderScene = new RenderPass(scene, camera);

// Configurable parameters: (resolution, strength, radius, threshold)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.5, 0.8);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
// composer.addPass( bloomPass );


// texture
var ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/');
ktx2Loader.detectSupport(renderer);

// resize canvas on resize window
window.addEventListener('resize', () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

// shop model
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/libs/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load('assets/ramenShop.gltf', function (gltf) {

    const shop = gltf.scene;

    // graphicsJoined
    const graphicsJoined = shop.getObjectByName("graphicsJoined", true);
    ktx2Loader.load('assets/texture/graphicsBaked512.ktx2', function (texture) {

        // var material = new THREE.MeshStandardMaterial( { map: texture } );
        var material = new THREE.MeshBasicMaterial({ map: texture });
        graphicsJoined.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // jesseZhouJoined
    const jesseZhouJoined = shop.getObjectByName("jesseZhouJoined", true);
    ktx2Loader.load('assets/texture/graphicsBaked512.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        jesseZhouJoined.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // machinesJoined
    const machinesJoined = shop.getObjectByName("machinesJoined", true);
    ktx2Loader.load('assets/texture/machinesBaked1024.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        machinesJoined.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // ramenShopJoined
    const ramenShopJoined = shop.getObjectByName("ramenShopJoined", true);
    ktx2Loader.load('assets/texture/ramenShopBaked1024.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        // var material = new THREE.MeshStandardMaterial( { map: texture } );
        ramenShopJoined.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // miscJoined
    const miscJoined = shop.getObjectByName("miscJoined", true);
    ktx2Loader.load('assets/texture/miscBaked1024.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        miscJoined.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // floor   

    const floor = shop.getObjectByName("floor", true);
    ktx2Loader.load('assets/texture/floorBaked1024.ktx2', function (texture) {

        // var material = new THREE.MeshStandardMaterial( { map: texture } );
        var material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, opacity: 0.6, roughness: 0.7 });
        floor.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // reflector effect

    let geometry = new THREE.CircleGeometry(40, 64);
    let groundMirror = new Reflector(geometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0xb5b5b5,
    });
    groundMirror.position.y = 0.1;
    groundMirror.reflectivity = 0.9;
    groundMirror.rotateX(- Math.PI / 2);
    scene.add(groundMirror);


    // easelFrontGraphic
    const easelFrontGraphic = shop.getObjectByName("easelFrontGraphic", true);
    ktx2Loader.load('assets/texture/easelClick.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        easelFrontGraphic.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // vendingMachineScreen
    const vendingMachineScreen = shop.getObjectByName("vendingMachineScreen", true);
    ktx2Loader.load('assets/texture/vendingMachineDefault.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        vendingMachineScreen.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // arcadeScreen
    const arcadeScreen = shop.getObjectByName("arcadeScreen", true);
    ktx2Loader.load('assets/texture/arcadeScreenDefault.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        arcadeScreen.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // bigScreen
    const bigScreen = shop.getObjectByName("bigScreen", true);
    ktx2Loader.load('assets/texture/bigScreenDefault.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        bigScreen.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // dish
    const dish = shop.getObjectByName("dish", true);
    ktx2Loader.load('assets/texture/dishMatcap.ktx2', function (texture) {

        var material = new THREE.MeshPhongMaterial({ color: "#0E454C", shininess: 100 });
        dish.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // dishStand
    const dishStand = shop.getObjectByName("dishStand", true);
    ktx2Loader.load('assets/texture/dishMatcap.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        dishStand.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });

    // fans
    const fan1 = shop.getObjectByName("fan1", true);
    const fan2 = shop.getObjectByName("fan2", true);
    ktx2Loader.load('assets/texture/fanMatcap.ktx2', function (texture) {

        var material = new THREE.MeshStandardMaterial({ map: texture });
        fan1.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })
        fan2.traverse(texture => {
            if (texture.isMesh) {
                texture.material = material;
            }
        })

    }, function () {
    }, function (e) {
        console.error(e);
    });


    // neonPink
    // var neonPinkMaterial = new THREE.MeshStandardMaterial({color: '#7E2B71', shininess: 100});
    var neonPinkMaterial = new THREE.MeshBasicMaterial({ color: '#fff' });
    neonPinkMaterial.userData.needsBloom = true;
    const neonPink = shop.getObjectByName("neonPink", true);
    neonPink.traverse(texture => {
        if (texture.isMesh) {
            texture.material = neonPinkMaterial;
        }
    })

    // neonBlue
    // var neonBlueMaterial = new THREE.MeshStandardMaterial({color: '#3CFFFF', shininess: 100});
    var neonBlueMaterial = new THREE.MeshBasicMaterial({ color: '#3CFFFF' });
    neonBlueMaterial.userData.needsBloom = true;
    const neonBlue = shop.getObjectByName("neonBlue", true);
    neonBlue.traverse(texture => {
        if (texture.isMesh) {
            texture.material = neonBlueMaterial;
        }
    })

    // neonGreen
    // var neonGreenMaterial = new THREE.MeshStandardMaterial({color: '#18FFFF', shininess: 100});
    var neonGreenMaterial = new THREE.MeshBasicMaterial({ color: '#18FFFF' });
    const neonGreen = shop.getObjectByName("neonGreen", true);
    neonGreen.traverse(texture => {
        if (texture.isMesh) {
            texture.material = neonGreenMaterial;
        }
    })

    // neonYellow
    const neonYellow = shop.getObjectByName("neonYellow", true);
    // var neonYellowMaterial = new THREE.MeshStandardMaterial({color: '#FFFAA3', shininess: 100});
    var neonYellowMaterial = new THREE.MeshBasicMaterial({ color: '#FFFAA3' });
    neonYellow.traverse(texture => {
        if (texture.isMesh) {
            texture.material = neonYellowMaterial;
        }
    })

    // arcadeRim
    // var neonMaterial = new THREE.MeshPhongMaterial({color: '#FFFAA3', shininess: 100});
    var neonMaterial = new THREE.MeshBasicMaterial({ color: '#FFFAA3' });
    const arcadeRim = shop.getObjectByName("arcadeRim", true);
    arcadeRim.traverse(texture => {
        if (texture.isMesh) {
            texture.material = neonMaterial;
        }
    })

    // chinese
    const chinese = shop.getObjectByName("chinese", true);
    // var chineseMaterial = new THREE.MeshStandardMaterial({color: '#3bf79c'});
    var chineseMaterial = new THREE.MeshBasicMaterial({ color: '#57FF90' });
    chinese.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // poleLight

    const bloomRenderer = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight
    );
    bloomPass.renderTarget = bloomRenderer;

    const poleLight = shop.getObjectByName("poleLight", true);
    // var chineseMaterial = new THREE.MeshStandardMaterial({color: '#fff'});
    // var poleLightMaterial = new THREE.MeshBasicMaterial({color: '#fff'});

    const pngLoader = new THREE.TextureLoader();
    var poleLightMaterial = new THREE.MeshBasicMaterial({ lightMap: pngLoader.load("assets/texture/lightMatcap.png") });

    // poleLightMaterial.userData.needsBloom = true;

    poleLight.traverse(texture => {
        if (texture.isMesh) {
            texture.material = poleLightMaterial;
        }
    })

    // blueLights
    const blueLights = shop.getObjectByName("blueLights", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#40d1f5' });
    blueLights.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // redLED
    const redLED = shop.getObjectByName("redLED", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#FF4268' });
    redLED.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // greenLED
    const greenLED = shop.getObjectByName("greenLED", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#00FF00' });
    greenLED.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // whiteButton
    const whiteButton = shop.getObjectByName("whiteButton", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#fff' });
    whiteButton.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // yellowRightLight
    const yellowRightLight = shop.getObjectByName("yellowRightLight", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#FF9000' });
    yellowRightLight.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // greenSignSquare
    const greenSignSquare = shop.getObjectByName("greenSignSquare", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#57FF90' });
    greenSignSquare.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // creditsOrange
    const creditsOrange = shop.getObjectByName("creditsOrange", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#FF9000' });
    creditsOrange.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // jZhouPink
    const jZhouPink = shop.getObjectByName("jZhouPink", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#FF6DE9' });
    jZhouPink.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // projectsRed
    const projectsRed = shop.getObjectByName("projectsRed", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#FF0071' });
    projectsRed.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // projectsWhite
    const projectsWhite = shop.getObjectByName("projectsWhite", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#fff' });
    projectsWhite.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // articlesRed
    const articlesRed = shop.getObjectByName("articlesRed", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#FF0071' });
    articlesRed.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // articlesWhite
    const articlesWhite = shop.getObjectByName("articlesWhite", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#fff' });
    articlesWhite.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // aboutMeBlue
    const aboutMeBlue = shop.getObjectByName("aboutMeBlue", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#10EDFF' });
    aboutMeBlue.traverse(texture => {
        if (texture.isMesh) {
            texture.material = chineseMaterial;
        }
    })

    // storageLight
    const storageLight = shop.getObjectByName("storageLight", true);
    var storageMaterial = new THREE.MeshStandardMaterial({ color: '#00DAFF' });
    storageLight.traverse(texture => {
        if (texture.isMesh) {
            texture.material = storageMaterial;
        }
    })

    // portalLight
    const portalLight = shop.getObjectByName("portalLight", true);
    var chineseMaterial = new THREE.MeshStandardMaterial({ color: '#00DAFF' });
    portalLight.traverse(texture => {
        if (texture.isMesh) {
            texture.material = storageMaterial;
        }
    })

    scene.add(gltf.scene);

}, undefined, function (error) {
    console.error(error);
});

// ramenHologram model

const loader1 = new GLTFLoader();
loader1.setDRACOLoader(dracoLoader);

parent = new THREE.Object3D();
scene.add(parent);

loader1.load('assets/ramenHologram.gltf', function (gltf) {

    const hologram = gltf.scene;
    hologram.scale.set(0.023, 0.023, 0.023);
    hologram.position.set(0, 5, -1);

    // scene.add(gltf.scene);

    const scene = gltf.scene;
    // Create a BufferGeometry to hold the particle positions
    const geometry = new THREE.BufferGeometry();

    // Extract the vertex positions from the glTF model
    const positions = [];
    const mesh = scene.children[0]; // Assuming the particles are in the first child object
    mesh.geometry.getAttribute('position').array.forEach((value) => {
        positions.push(value);
    });

    // Add the positions array as a Float32 buffer attribute to the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

    // Create a material for the particles (e.g., points with a texture)
    const material = new THREE.PointsMaterial({
        size: 0.1,
        // map: YOUR_PARTICLE_TEXTURE,
        color: 0xfff,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });

    // Create a Points object and add it to the scene
    const particles = new THREE.Points(geometry, material);
    particles.position.set(0, 5, -1);
    scene.add(particles);

}, undefined, function (error) {
    console.error(error);
});

// onclick event
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
    mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);

    intersects.forEach((hit) => {
        
        console.log(hit.object.name);
    })
})

function animate() {
    requestAnimationFrame(animate);
    // renderer.render(scene, camera);
    composer.render();
}

animate()