import { BasicGun } from "./basicGun";
import { BasicBullet } from "./basicBullet";
import { Enemy } from "./enemy";
import { BASICBULLET_DEFAULT_SPEED, FREEZEGUN_DEFAULT_RANGE, FREEZEGUN_DEFAULT_COOLDOWN, FREEZEGUN_DEFAULT_DURATION, FREEZEGUN_DEFAULT_PERCENT, FREEZEBULLET_PARTICLE_NUM, FREEZEBULLET_PARTICLE_LIFE } from "./config";
import { rpgItemSpriteKey } from "./utils";
import { rpgItem } from "./rpgItemEnum";
import { Circle, Sprite } from "phaser-ce";
import { explodeGroup } from "./globals";
import { SlowExplosion } from "./slowExplosion";
import { FreezeBullet } from "./freezeBullet";
import { upgradeAccordingly, UPGRADE_FREEZE_GUN_POWER_AMOUNTS, UPGRADE_FREEZE_GUN_POWER_MAX, UPGRADE_FREEZE_GUN_SPEED_AMOUNTS, UPGRADE_FREEZE_GUN_SPEED_MIN, UPGRADE_FREEZE_GUN_SPECIAL_AMOUNT } from "./upgradeConfig";

export class FreezeGun extends BasicGun{

    private explodeRange = FREEZEGUN_DEFAULT_RANGE;
    protected coolDownInFrame = FREEZEGUN_DEFAULT_COOLDOWN;
    private duration = FREEZEGUN_DEFAULT_DURATION;
    private percent = FREEZEGUN_DEFAULT_PERCENT;

    weaponUpdate(allEnemies: Set<Enemy>){
        super.weaponUpdate(allEnemies);
        this.game.physics.arcade.overlap(Array.from(allEnemies),
                                         Array.from(explodeGroup),
                                        this.onExplodeOverlap)
    }

    protected updateRange(){
    }

    createBullet(): BasicBullet{
        const spd = BASICBULLET_DEFAULT_SPEED;
        const angle = this.rotation - this.faceNorthAngle;
        let bb = new FreezeBullet(this.game, this.x, this.y, rpgItemSpriteKey, rpgItem.ShieldBronze,
                                  this.percent, this.duration, this.explodeRange, spd, angle);
        return bb
    }

    onBulletOverlap(enemy:Enemy, bullet: FreezeBullet){
        const game = bullet.game;
        if(bullet.alive){
            const slow = new SlowExplosion(game, enemy.x, enemy.y, rpgItemSpriteKey,rpgItem.ShieldWood,
                                           bullet.getPercent(), bullet.getDuration(), bullet.getRange());
        }
        bullet.destroy();
    }

    onExplodeOverlap(enemy: Enemy, explode: SlowExplosion){
        enemy.becomeSlowed(explode.getPercent(), explode.getDuration())

        // prevent too much particles being rendered
        if(explode.explosed){
            return;
        }
        const emiter = explode.game.add.emitter(explode.x, explode.y, FREEZEBULLET_PARTICLE_NUM);
        emiter.makeParticles(rpgItemSpriteKey, rpgItem.ScrollCloth, FREEZEBULLET_PARTICLE_NUM);
        emiter.lifespan = FREEZEBULLET_PARTICLE_LIFE;
        emiter.height = explode.getRange();
        emiter.width = explode.getRange();
        emiter.setAlpha(0.5,0.8);
        emiter.setRotation(0,0);
        emiter.start(true, FREEZEBULLET_PARTICLE_LIFE, null, FREEZEBULLET_PARTICLE_NUM, true);

        explode.explosed = true;
    }

    private freeze_powerUpgradePtr = 0;
    onPowerUpgrade(amount:number){
        const upgradeAmount = upgradeAccordingly(UPGRADE_FREEZE_GUN_POWER_AMOUNTS, this.freeze_powerUpgradePtr);
        this.percent = Math.min(this.percent + upgradeAmount,
                               UPGRADE_FREEZE_GUN_POWER_MAX)
        this.freeze_powerUpgradePtr += amount;
    }

    private freeze_speedUpgradePtr = 0;
    onSpeedUpgrade(amount:number){
        const upgradeAmount = upgradeAccordingly(UPGRADE_FREEZE_GUN_SPEED_AMOUNTS, this.freeze_speedUpgradePtr);
        this.coolDownInFrame = Math.max(UPGRADE_FREEZE_GUN_SPEED_MIN,
                                        this.coolDownInFrame - upgradeAmount);
        this.freeze_speedUpgradePtr += amount;
    }

    onSpecialUpgrade(amount:number){
        this.explodeRange += amount*UPGRADE_FREEZE_GUN_SPECIAL_AMOUNT;
    }

    getWeaponInfo(): string{
        let info = super.getWeaponInfo();
        info += "percentage: " + this.percent + '\n'
        info += 'duration :' + this.duration + '\n'
        info += "Explode range: " + this.explodeRange + '\n'
        return info;
    }
}
