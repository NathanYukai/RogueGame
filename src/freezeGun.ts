import { BasicGun } from "./basicGun";
import { BasicBullet } from "./basicBullet";
import { Enemy } from "./enemy";
import { BASICBULLET_DEFAULT_SPEED } from "./config";
import { rpgItemSpriteKey } from "./utils";
import { rpgItem } from "./rpgItemEnum";
import { Circle } from "phaser-ce";

export class FreezeGun extends BasicGun{

    private explodeRange: number;
    private explods: Set<Circle>;

    weaponUpdate(allEnemies: Set<Enemy>){
        super.weaponUpdate(allEnemies);
        this.game.physics.arcade.overlap(Array.from(allEnemies),
                                         Array.from(this.explods),
                                        this.onExplodeOverlap)
    }

    createBullet(): BasicBullet{
        const spd = BASICBULLET_DEFAULT_SPEED;
        const angle = this.rotation - this.faceNorthAngle;
        let bb = new BasicBullet(this.game, this.x, this.y, rpgItemSpriteKey, rpgItem.ShieldBronze,
                                 this.power, spd, angle);
        return bb
    }

    onBulletOverlap(enemy:Enemy, bullet: BasicBullet){
        enemy.becomeSlowed(0.3, 100);
        bullet.destroy();
    }

    onExplodeOverlap(enemy: Enemy, explode: Circle){
        
    }

    getWeaponInfo(): string{
        let info = super.getWeaponInfo();
        info += "Explode range: " + this.explodeRange;
        return info;
    }
}
