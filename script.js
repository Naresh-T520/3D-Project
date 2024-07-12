let scene, camera, renderer, controls;
let currentScene = 0;
const scenes = [];
const planets = [];

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createSolarSystemScene();
    createGalaxyScene();
    createSpaceStationScene();

    camera.position.z = 50;

    // GUI controls
    const gui = new dat.GUI();
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'z', 20, 100);
    cameraFolder.open();

    const sceneFolder = gui.addFolder('Scene');
    sceneFolder.add({ Scene: 'Solar System' }, 'Scene', ['Solar System', 'Galaxy', 'Space Station']).onChange(switchScene);
    sceneFolder.open();
}

function createSolarSystemScene() {
    const solarSystemScene = new THREE.Scene();
    scenes.push(solarSystemScene);

    // Create sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    solarSystemScene.add(sun);

    // Create planets
    const planetColors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];
    for (let i = 0; i < 4; i++) {
        const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ color: planetColors[i] });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.x = 10 + i * 5;
        solarSystemScene.add(planet);
        planets.push(planet);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    solarSystemScene.add(ambientLight);
}

function createGalaxyScene() {
    const galaxyScene = new THREE.Scene();
    scenes.push(galaxyScene);

    // Create a particle system for stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    galaxyScene.add(starField);
}

function createSpaceStationScene() {
    const spaceStationScene = new THREE.Scene();
    scenes.push(spaceStationScene);

    // Create a simple space station
    const stationGeometry = new THREE.BoxGeometry(10, 2, 2);
    const stationMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const station = new THREE.Mesh(stationGeometry, stationMaterial);
    spaceStationScene.add(station);

    // Add solar panels
    const panelGeometry = new THREE.PlaneGeometry(6, 2);
    const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF, side: THREE.DoubleSide });
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-8, 0, 0);
    leftPanel.rotation.y = Math.PI / 2;
    station.add(leftPanel);

    const rightPanel = leftPanel.clone();
    rightPanel.position.set(8, 0, 0);
    station.add(rightPanel);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    spaceStationScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    spaceStationScene.add(directionalLight);
}

function switchScene(sceneName) {
    switch(sceneName) {
        case 'Solar System':
            currentScene = 0;
            break;
        case 'Galaxy':
            currentScene = 1;
            break;
        case 'Space Station':
            currentScene = 2;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (currentScene === 0) {
        // Animate planets in the solar system scene
        planets.forEach((planet, index) => {
            const angle = Date.now() * 0.001 * (index + 1) * 0.5;
            const radius = 10 + index * 5;
            planet.position.x = Math.cos(angle) * radius;
            planet.position.z = Math.sin(angle) * radius;
        });
    } else if (currentScene === 2) {
        // Rotate the space station
        scenes[2].children[0].rotation.y += 0.005;
    }

    renderer.render(scenes[currentScene], camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();

window.addEventListener('resize', onWindowResize);