<?php
session_start();

// Handle logout
if (isset($_GET['logout']) && $_GET['logout'] === 'true') {
    session_destroy(); // Destroy the session
    header('Location: http://localhost/ArcadeMania/menu/login.php'); // Redirect to the login page
    exit;
}

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: http://localhost/ArcadeMania/menu/login.php'); 
    exit;
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MatrixShooter</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Hangok -->
    <audio id="bgMusic" src="sound.MP3" loop></audio>
    <audio id="shootSound" src="shoot2.mp3"></audio>
    <!-- Game Over ablak -->
    <div id="gameOverModal" class="modal">
        <div class="modal-content">
            <h2>GAME OVER!</h2>
            <button id="restartButton">Restart</button>
            <p id="finalScore">Score: 0</p>
        </div>
    </div>
    <!--Menu -->
    <div id="blocker">
        <div id="instructions">
            <div id="playButton">
                <h3>Matrix Shooter</h3>
                <p>
                    ESC - Menu<br />
                    WASD ARROWS - Move<br />
                    LEFT MOUSE - Fire<br />
                    M - Play / Pause Music <br /><br /><br />
                    <button id="playMusicButton">Play menu music</button>
                </p>
                <p>ENTER TO PLAY</p>
                <p>In this game you have 30 seconds to kill as many enemy as you can</p>
                <p>Good luck!</p>
            </div>
        </div>
    </div>
    <!-- Three.js importalas -->
    <script src="https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@latest/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@latest/examples/js/controls/PointerLockControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@latest/examples/js/loaders/GLTFLoader.js"></script>
    <script type="module">
        // Jelenet beallitas
        let score = 0;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(9, 0.3, 3);
        const renderer = new THREE.WebGLRenderer({ alpha: true, depth: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.domElement.style.cssText = 'position: fixed; z-index: -1; left: 0; top: 0';
        renderer.domElement.id = 'renderer';
        document.body.appendChild(renderer.domElement);
        // Player
        const controls = new THREE.PointerLockControls(camera, document.body);
        scene.add(controls.getObject());
        // UI logika
        const blocker = document.getElementById('blocker');
        const instructions = document.getElementById('instructions');
        const playButton = document.getElementById('playButton');
        const music = document.getElementById('bgMusic'); 
        const menuMusic = new Audio('menu1.MP3');
        menuMusic.loop = true;
        menuMusic.volume = 1;  // itt a MENUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU HANG
        let playerHealth = 100;
        const healthDisplay = document.getElementById('healthDisplay');
        let gameStarted = false;

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Enter' && blocker.style.display !== 'none') {
                controls.lock();
            }
        });
        playMusicButton.addEventListener('click', () => {
            menuMusic.play().then(() => {
                console.log("Zene elindult.");
                playMusicButton.disabled = true;
                playMusicButton.innerText = "Zene szól";
            }).catch(err => {
                console.warn("Nem sikerült elindítani a zenét:", err);
            });
        });
        controls.addEventListener('lock', () => {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
            music.volume = 0.9; 
            healthDisplay.style.display = 'block';
            music.play().catch(e => console.error("Zene nem indult el:", e));
            menuMusic.pause();
            menuMusic.currentTime = 0;
            gameStarted = false; 
            startGame(); 
        });
        controls.addEventListener('unlock', () => {
            blocker.style.display = 'block';
            instructions.style.display = '';
            healthDisplay.style.display = 'none';
            music.pause();
            music.currentTime = 0;
           if (menuMusic.paused) {
                menuMusic.play().catch(e => console.warn("Menüzene újraindítása sikertelen:", e));
            }
        });
        function updateHealth(amount) {
            playerHealth = Math.max(0, playerHealth + amount); 
            healthDisplay.textContent = `Élet: ${playerHealth}`;
        }
        // Világítás
        scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7.5);
        scene.add(dirLight);
        // Környezet
        const gridHelper = new THREE.GridHelper(20, 20);
        gridHelper.material.color.set(0x228B22);
        scene.add(gridHelper);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('floor.jpg', () => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
        });
        const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        );
        ground.rotation.x = Math.PI / 2;
        scene.add(ground);
        const loader = new THREE.TextureLoader();
        const skyTexture = loader.load('sky44.jpg');
        const skyGeo = new THREE.SphereGeometry(100, 32, 32);
        const skyMat = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide 
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);
        const wallTexture = textureLoader.load('wall11.jpg'); 
        // Pálya
        const obstacles = [];
        function createObstacle(x, y, z) {
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshStandardMaterial({ map: wallTexture })
            );
            cube.position.set(x, y + 0.5, z);
            scene.add(cube);
            obstacles.push(cube);
        }
        for (let i = 0; i < 15; i++) {
            createObstacle(-5 + i, 0, -5);
            createObstacle(-5, 0, -5 + i);
        }
        for (let i = 0; i < 15; i++) {
            createObstacle(+10 - i, 0, +10);
            createObstacle(+10, 0, +10 - i);
        }
        createObstacle(2, 0, 2);
        createObstacle(5, 0, 2);
        createObstacle(3, 0, 2);
        createObstacle(4, 0, 2);
        function checkCollision(position) {
            const playerBox = new THREE.Box3().setFromCenterAndSize(position, new THREE.Vector3(0.5, 1.6, 0.5));
            return obstacles.some(ob => playerBox.intersectsBox(new THREE.Box3().setFromObject(ob)));
        }

        // Player mozgás
        let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
        document.addEventListener('keydown', e => {
            switch (e.code) {
                case 'ArrowUp': case 'KeyW': moveForward = true; break;
                case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
                case 'ArrowDown': case 'KeyS': moveBackward = true; break;
                case 'ArrowRight': case 'KeyD': moveRight = true; break;
            }
        });
        document.addEventListener('keyup', e => {
            switch (e.code) {
                case 'ArrowUp': case 'KeyW': moveForward = false; break;
                case 'ArrowLeft': case 'KeyA': moveLeft = false; break;
                case 'ArrowDown': case 'KeyS': moveBackward = false; break;
                case 'ArrowRight': case 'KeyD': moveRight = false; break;
            }
        });
        // Lövő rendszer
        const bullets = [];
        const bulletSpeed = 1;
        document.addEventListener('mousedown', e => {
            if (e.button === 0 && controls.isLocked) shootBullet();
        });
        const shootSound = document.getElementById('shootSound');
        let canShoot = true;  
        const shootCooldown = 500; //ms
        function shootBullet() {
            if (!canShoot) return;  
            canShoot = false;       
            setTimeout(() => {
                canShoot = true;    
            }, shootCooldown);
            shootSound.currentTime = 0;  
            shootSound.volume = 0.7; //LÖVÉS HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANG ÁLLÍTÁSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            shootSound.play().catch(e => console.error("Nem indult el a lövés hang:", e));
            const bullet = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xDDDDDD })
            );
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const startPos = controls.getObject().position.clone();
            const offset = direction.clone().multiplyScalar(0.5); // golyócska helye a kamerához képest előrébb itt
            startPos.add(offset); 
            startPos.y -= 0.15; // kamerához lejjebb a golllllyó
            bullet.position.copy(startPos);
            bullets.push({ mesh: bullet, direction: direction.clone() });
            scene.add(bullet);
            setTimeout(() => {
            const index = bullets.findIndex(b => b.mesh === bullet);
            if (index !== -1) {
                scene.remove(bullet);
                bullets.splice(index, 1);
            }
            }, 10000);
        }
        //enemy típusok
        const enemyTypes = {
            enemy1: {
                walk: ['ellenseg/demon/walk1.png', 'ellenseg/demon/walk2.png', 'ellenseg/demon/walk3.png', 'ellenseg/demon/walk4.png'],
                attack: ['ellenseg/demon/attack1.png', 'ellenseg/demon/attack2.png'],
                speed: 0.01,
                size: { x: 0.8, y: 1.1 },
                height: 0.5
            },
            enemy2: {
                walk: ['ellenseg/soldier/walk1.png', 'ellenseg/soldier/walk2.png', 'ellenseg/soldier/walk3.png', 'ellenseg/soldier/walk4.png'],
                attack: ['ellenseg/soldier/attack1.png', 'ellenseg/soldier/attack2.png'],
                speed: 0.008,
                size: { x: 0.3, y: 0.6 },
                height: 0.23
            },
            enemy3: {
                walk: ['ellenseg/caco/walk1.png', 'ellenseg/caco/walk2.png', 'ellenseg/caco/walk3.png'],
                attack: ['ellenseg/caco/attack1.png', 'ellenseg/caco/attack2.png', 'ellenseg/caco/attack3.png', 'ellenseg/caco/attack4.png', 'ellenseg/caco/attack5.png'],
                speed: 0.012,
                size: { x: 0.7, y: 0.7 },
                height: 0.8
            }
        };
        const enemyBullets = [];
        const enemyBulletSpeed = 0.02;
        const enemyShootCooldown = 1500; 
        // Enemy osztály sprite animációval
        class Enemy {
            constructor(typeKey, position) {
                this.type = enemyTypes[typeKey];
                this.state = 'walk';
                this.frameIndex = 0;
                this.frameTimer = 0;
                this.frameInterval = 500;
                this.speed = this.type.speed;
                this.lastShootTime = 0;  
                // Előre betöltött textúrák tárolása
                this.textures = {
                    walk: this.type.walk.map(path => new THREE.TextureLoader().load(path)),
                    attack: this.type.attack.map(path => new THREE.TextureLoader().load(path))
                };
                this.material = new THREE.MeshBasicMaterial({
                    map: this.textures.walk[0],
                    transparent: true,
                    side: THREE.DoubleSide
                });
                this.geometry = new THREE.PlaneGeometry(this.type.size.x, this.type.size.y);
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.mesh.position.copy(position);
                this.mesh.lookAt(camera.position);
                scene.add(this.mesh);
            }
            shoot(playerPos) {
                const bullet = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0xff0000 })
                );
                bullet.position.copy(this.mesh.position);
                // irány a játékos felé
                const direction = playerPos.clone().sub(this.mesh.position).normalize();
                enemyBullets.push({ mesh: bullet, direction: direction });
                scene.add(bullet);
            }
            dispose() {
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
            }
           update(delta, playerPos, timeNow) {
                const distance = this.mesh.position.distanceTo(playerPos);
                this.state = distance < 3 ? 'attack' : 'walk';

                if (this.state === 'walk') {
                    const dir = playerPos.clone().sub(this.mesh.position);
                    dir.y = 0; // maradjon az enemy heightje JÓ
                    dir.normalize();

                    // enemy hogy menjen
                    this.mesh.position.add(dir.multiplyScalar(this.speed * delta));

                    // enemy height
                    this.mesh.position.y = this.type.height; 
                } else if (this.state === 'attack') {
                    // lövés cooldown
                    if (timeNow - this.lastShootTime > enemyShootCooldown) {
                        this.shoot(playerPos);
                        this.lastShootTime = timeNow;
                    }
                    // fix height
                    this.mesh.position.y = this.type.height;
                }

                // animacio
                this.frameTimer += delta * 1000;
                if (this.frameTimer >= this.frameInterval) {
                    this.frameTimer = 0;
                    this.frameIndex++;
                    const frames = this.textures[this.state];
                    if (this.frameIndex >= frames.length) this.frameIndex = 0;
                    this.material.map = frames[this.frameIndex];
                    this.material.needsUpdate = true;
                }
                this.mesh.lookAt(camera.position);
            }
        }

        function spawnEnemyRandomly() {
            const randomInterval = Math.random() * 500 + 400; 

            setTimeout(() => {

                const enemyTypeKeys = Object.keys(enemyTypes);
                const randomIndex = Math.floor(Math.random() * enemyTypeKeys.length);
                const typeKey = enemyTypeKeys[randomIndex];

                const fixedY = enemyTypes[typeKey].height;
                const position = getRandomSpawnPosition(fixedY);

                const enemy = new Enemy(typeKey, position);
                enemies.push(enemy);

                spawnEnemyRandomly();
            }, randomInterval);
        }

        let enemies = [];
        // Időzítő
        let timer = 40;  // 40 másodperc
        let timerInterval = null;  
        const timerDisplay = document.getElementById('timerDisplay');  
        // GAME OVER ablak
        const modal = document.getElementById('gameOverModal');
        const restartButton = document.getElementById('restartButton');
        const exitButton = document.getElementById('exitButton');
        let isPointerLocked = false;

        function startTimer() {
            timer = 40;  
            timerDisplay.textContent = `Idő: ${timer}`;

            timerInterval = setInterval(() => {
                timer--;
                timerDisplay.textContent = `Idő: ${timer}`;
                if (timer <= 0) {
                    clearInterval(timerInterval); //idő megallit
                    showGameOverModal();  
                }
            }, 1000);
        }
        // A GAME OVER megjelenítése
        function showGameOverModal() {
            document.getElementById('finalScore').textContent = `Score: ${score}`;
            document.getElementById('gameOverModal').style.display = 'block';
            modal.style.display = 'flex';  
            unlockPointer(); 
            function updateMaxEredmenyInDatabase(score) {
                fetch('update_high_score.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ high_score: score }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Max eredmény frissítve az adatbázisban.');
                    } else {
                        console.error('Nem sikerült frissíteni a max eredményt:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Hiba a max eredmény frissítésekor:', error);
                });
            }
            updateMaxEredmenyInDatabase(score);
        }




        function getRandomSpawnPosition(fixedY) {
            const minX = -4;
            const maxX = 9;
            const minZ = -4;
            const maxZ = 9;

            const x = Math.random() * (maxX - minX) + minX;
            const z = Math.random() * (maxZ - minZ) + minZ;

            return new THREE.Vector3(x, fixedY, z);
        }
        
        // restart game
        restartButton.addEventListener('click', () => {
            modal.style.display = 'none';  
            location.reload(); 
        });
        function lockPointer() {
            if (!isPointerLocked) {
                document.body.requestPointerLock(); 
                isPointerLocked = true;
            }
        }
        function unlockPointer() {
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
            isPointerLocked = false;
        }
        //ellenség
        function spawnEnemies() {
        enemies = enemyData.map(data => new Enemy(data.id, data.position));
        }
        function startGame() {
        if (gameStarted) return;
        gameStarted = true;
            startTimer();  
            spawnEnemyRandomly();  
        }
        //Fegyver
        const loaderGLTF = new THREE.GLTFLoader();
        let playerGun;
        loaderGLTF.load('gun.glb', function (gltf) {
            playerGun = gltf.scene;
            playerGun.scale.set(0.1, 0.1, 0.1); // méret
            playerGun.position.set(0.1, -0.15, -0.3); // kamerához képest to cameraa
            playerGun.rotation.set(0, 30, 0); 
            controls.getObject().add(playerGun);
        }, undefined, function (error) {
            console.error('Fegyver betöltése sikertelen:', error);
        });

        //Animáció (játék főagya)
        function animate() {
            requestAnimationFrame(animate);
            if(playerHealth <= 0){
                showGameOverModal();
            }
            const timeNow = performance.now();
            const delta = 0.03; 
            if (controls.isLocked) {
                if (moveForward) { controls.moveForward(delta); if (checkCollision(controls.getObject().position)) controls.moveForward(-delta); }
                if (moveBackward) { controls.moveForward(-delta); if (checkCollision(controls.getObject().position)) controls.moveForward(delta); }
                if (moveLeft) { controls.moveRight(-delta); if (checkCollision(controls.getObject().position)) controls.moveRight(delta); }
                if (moveRight) { controls.moveRight(delta); if (checkCollision(controls.getObject().position)) controls.moveRight(-delta); }
            }
            //Lővések animációja
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                b.mesh.position.add(b.direction.clone().multiplyScalar(bulletSpeed * 0.1));
                if (b.mesh.position.distanceTo(controls.getObject().position) > 50) {
                    scene.remove(b.mesh);
                    bullets.splice(i, 1);
                    continue;
                }
                for (const ob of obstacles) {
                    if (new THREE.Box3().setFromObject(b.mesh).intersectsBox(new THREE.Box3().setFromObject(ob))) {
                        scene.remove(b.mesh);
                        bullets.splice(i, 1);
                        break;
                    }
                }
            }
            function updateEnemies(delta, playerPos, timeNow) {
                for (let i = 0; i < enemies.length; i++) {
                    enemies[i].update(delta, playerPos, timeNow);
                }
            }
            //Ellenségek frissítése
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                enemy.update(delta, controls.getObject().position, timeNow);
                const playerPos = controls.getObject().position;
                const distance = enemy.mesh.position.distanceTo(playerPos);
                if (distance > 3) {
                    const direction = playerPos.clone().sub(enemy.mesh.position).normalize();
                    enemy.mesh.position.add(direction.multiplyScalar(0.01));
                }
                enemy.update(delta, playerPos);
                for (let j = bullets.length - 1; j >= 0; j--) {
                    const b = bullets[j];
                    if (enemy.mesh.position.distanceTo(b.mesh.position) < 0.5) {
                        enemy.dispose();
                        scene.remove(enemy.mesh);
                        scene.remove(b.mesh);
                        enemies.splice(i, 1);
                        bullets.splice(j, 1);
                        score += 100; 
                        break;
                    }
                }
            }
            for (let i = enemyBullets.length - 1; i >= 0; i--) {
                const b = enemyBullets[i];
                b.mesh.position.add(b.direction.clone().multiplyScalar(enemyBulletSpeed * delta * 60));
                if (b.mesh.position.distanceTo(controls.getObject().position) < 0.5) {
                    updateHealth(-10); //sbezés
                    scene.remove(b.mesh);
                    enemyBullets.splice(i, 1);
                    continue;
                }
                // ha nem talál el a JÁTÉKOST
                if (b.mesh.position.distanceTo(controls.getObject().position) > 50) {
                    scene.remove(b.mesh);
                    enemyBullets.splice(i, 1);
                }
            }
            renderer.render(scene, camera);
        }
        animate();






















        

        function fetchMaxEredmenyFromDatabase() {
            fetch('get_high_score.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const score = data.high_score || 0;
                } else {
                    console.error('Nem sikerült lekérni a max eredményt:', data.message);
                }
            })
            .catch(error => {
                console.error('Hiba a max eredmény lekérésekor:', error);
            });
        }



















    </script>
    <div id="healthDisplay">Health: 100</div>
    <div id="timerDisplay">Time: 40</div>
</body>
</html>