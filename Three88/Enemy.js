// Enemy osztály sprite animációval
import { enemyTypes } from './enemytypes.js';

class Enemy {
    constructor(typeKey, position) {
        this.type = enemyTypes[typeKey];
        this.state = 'walk';
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.frameInterval = 500;
        this.speed = this.type.speed;
        this.lastShootTime = 0;  // utolsó lövés ideje

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

    update(delta, playerPos,timeNow) {
        const distance = this.mesh.position.distanceTo(playerPos);
        this.state = distance < 3 ? 'attack' : 'walk';

         if (this.state === 'walk') {
            const dir = playerPos.clone().sub(this.mesh.position).normalize();
            this.mesh.position.add(dir.multiplyScalar(this.speed * delta));
        } else if (this.state === 'attack') {
            // lövés cooldown kezelése
            if (timeNow - this.lastShootTime > enemyShootCooldown) {
                this.shoot(playerPos);
                this.lastShootTime = timeNow;
            }
        }

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

export default Enemy;
