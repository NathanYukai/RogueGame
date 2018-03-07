import { BasicGun } from "./basicGun";
import { BasicBullet } from "./basicBullet";
import { Enemy } from "./enemy";

export class FreezeGun extends BasicGun{

    onBulletOverlap(enemy:Enemy, bullet: BasicBullet){
        enemy.becomeSlowed(0.3, 100);
        bullet.destroy();
    }
}
