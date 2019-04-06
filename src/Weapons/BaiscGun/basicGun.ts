import { PlayerWeapon } from '../playerweapon'
import { Enemy } from '../../Enemies/enemy';
import { BasicBullet } from './basicBullet';
import { rpgItemSpriteKey, myAngleBetween } from '../../utils';
import { rpgItem } from '../../rpgItemEnum';
import { UPGRADE_BASIC_GUN_POWER_AMOUNTS, UPGRADE_BASIC_GUN_SPEED_AMOUNTS, UPGRADE_BASIC_GUN_SPEED_MIN, UPGRADE_BASIC_GUN_SPECIAL_AMOUNTS, upgradeAccordingly } from '../../Configs/upgradeConfig';
import { BASICGUN_DEFAULT_COOLDOWN, BASICGUN_INITIAL_ANGLE, BASICGUN_DEFAULT_POWER, BASICBULLET_DEFAULT_SPEED } from '../../Configs/config';

export class BasicGun extends PlayerWeapon {
    name = "Bow"
    protected coolDownInFrame = BASICGUN_DEFAULT_COOLDOWN
    private coolDownCount = 0;
    private bullets: Set<BasicBullet>;
    private angleAllow = BASICGUN_INITIAL_ANGLE;

    private lineLeft: Phaser.Graphics;
    private lineRight: Phaser.Graphics;
    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number,
        power = BASICGUN_DEFAULT_POWER) {
        super(game, x, y, key, frame, power);
        this.bullets = new Set();

        this.lineLeft = this.game.add.graphics(0, 0);
        this.lineRight = this.game.add.graphics(0, 0);
    }

    setCoolDown(cd: number) {
        this.coolDownInFrame = cd;
    }

    private getAllEnemeyWithInAngle(enemies: Set<Enemy>): Set<Enemy> {
        let res = new Set;

        for (let e of enemies) {
            const angleBetween = myAngleBetween(this, e)
            const upper = this.getUpperAngle();
            const lower = this.getLowerAngle();
            let withIn = lower < angleBetween && angleBetween < upper
            if (withIn) {
                res.add(e);
            }
        }
        return res;
    }

    private getUpperAngle() {
        return this.getPointingOutAngle() + this.angleAllow
    }

    private getLowerAngle() {
        return this.getPointingOutAngle() - this.angleAllow
    }

    private getPointingOutAngle() {
        return myAngleBetween(this.owner, this)
    }

    protected updateRange() {
        const upper = this.getUpperAngle();
        const lower = this.getLowerAngle();

        const lineLeftX = this.x + 100 * Math.cos(upper);
        const lineLeftY = this.y + 100 * Math.sin(upper);
        const lineRightX = this.x + 100 * Math.cos(lower);
        const lineRightY = this.y + 100 * Math.sin(lower);


        this.lineLeft.clear();
        this.lineLeft.lineStyle(10, 0xFF0000, 1);
        this.lineLeft.alpha = 0.1;
        this.lineLeft.moveTo(this.x, this.y);
        this.lineLeft.lineTo(lineLeftX, lineLeftY);
        this.lineLeft.endFill();

        this.lineRight.clear();
        this.lineRight.lineStyle(10, 0xFF0000, 1);
        this.lineRight.alpha = 0.1;
        this.lineRight.moveTo(this.x, this.y);
        this.lineRight.lineTo(lineRightX, lineRightY);
        this.lineRight.endFill();
    }

    weaponUpdate(allEnemies: Set<Enemy>) {
        const enemiesInRange = this.getAllEnemeyWithInAngle(allEnemies);
        this.followRotate();
        this.updateRange();

        this.rotateToClosestEnemy(enemiesInRange)
        this.fireBullet();
        this.updateBullets();
        this.game.physics.arcade.overlap(Array.from(allEnemies),
            Array.from(this.bullets),
            this.onBulletOverlap);
    }

    private rotateToClosestEnemy(enemies: Set<Enemy>) {
        const closestEnemy = this.game.physics.arcade.closest(this, Array.from(enemies));
        this.rotation = closestEnemy ? myAngleBetween(this, closestEnemy) : this.getPointingOutAngle();
        this.rotation += this.faceNorthAngle;
    }

    private fireBullet() {
        this.coolDownCount--;
        if (this.coolDownCount <= 0) {
            this.coolDownCount = this.coolDownInFrame;
            const bb = this.createBullet();
            this.bullets.add(bb);
        }
    }

    protected createBullet(): BasicBullet {
        const spd = BASICBULLET_DEFAULT_SPEED;
        const angle = this.rotation - this.faceNorthAngle;
        let bb = new BasicBullet(this.game, this.x, this.y, rpgItemSpriteKey, rpgItem.Spear,
            this.power, spd, angle);
        return bb
    }

    private updateBullets() {
        for (let b of this.bullets) {
            if (!b.alive) {
                this.bullets.delete(b);
            }
        }
    }

    onBulletOverlap(enemy: Enemy, bullet: BasicBullet) {
        enemy.damage(bullet.getPower());
        bullet.destroy();
    }

    private powerUpgradePtr = 0;
    onPowerUpgrade(amount: number) {
        const powerUpgradeAmount = upgradeAccordingly(UPGRADE_BASIC_GUN_POWER_AMOUNTS, this.powerUpgradePtr)
        this.power += powerUpgradeAmount;
        this.speedUpgradePtr += amount;
    }

    private speedUpgradePtr = 0;
    onSpeedUpgrade(amount: number) {
        const upgradeAmount = upgradeAccordingly(UPGRADE_BASIC_GUN_SPEED_AMOUNTS, this.speedUpgradePtr)
        this.coolDownInFrame = Math.max(UPGRADE_BASIC_GUN_SPEED_MIN,
            this.coolDownInFrame - upgradeAmount);
        this.speedUpgradePtr += amount;
    }

    private specialUpgradePtr = 0;
    onSpecialUpgrade(amount: number) {
        const upgradeAmount = upgradeAccordingly(UPGRADE_BASIC_GUN_SPECIAL_AMOUNTS, this.specialUpgradePtr)
        this.angleAllow += upgradeAmount / 180 * Math.PI;
        this.specialUpgradePtr += amount;
    }

    getWeaponInfo(): string {
        let info = super.getWeaponInfo();
        info += "Aim angle: " + this.angleAllow * 180 / Math.PI + '\n'
        info += "\n\n"
        return info
    }

    destroy() {
        this.lineLeft.destroy();
        this.lineRight.destroy();
        super.destroy();
    }

}
