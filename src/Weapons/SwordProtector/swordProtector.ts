import { Sprite } from 'phaser-ce';
import { PlayerWeapon } from '../playerweapon';
import { SWORD_DEFAULT_COOLDOWN, SWORD_DEFAULT_ATTACKFRAME, SWORD_SPECIAL_CHARGE_MAX, SWORD_SPECIAL_ATTACK_TIME, SWORD_DEFAULT_POWER, SWORD_SPECIAL_POWER_MULTIPLY } from '../../Configs/config';
import { Enemy } from '../../Enemies/enemy';
import { myAngleBetween } from '../../utils';
import { UPGRADE_SWORD_POWER_AMOUNT, upgradeAccordingly, UPGRADE_SWORD_SPEED_AMOUNTS, UPGRADE_SWORD_SPEED_MIN, UPGRADE_SWORD_SPECIAL_MIN, UPGRADE_SWORD_SPECIAL_AMOUNT } from '../../Configs/upgradeConfig';

enum SwordState {
    SPECIAL_ATTACK,
    SPECIAL_READY,
    READY,
    ATTACK,
    REST
}

export class SwordProtector extends PlayerWeapon {
    name = "Sword"

    protected coolDownInFrame = SWORD_DEFAULT_COOLDOWN
    private coolDownCount = this.coolDownInFrame
    private attackFrame = SWORD_DEFAULT_ATTACKFRAME;
    private attackFrameCountDown = this.attackFrame;

    private attackState = SwordState.REST;
    private damagedEnemy = new Set<Sprite>();
    private killCount = 0;
    private specialKillCharge = SWORD_SPECIAL_CHARGE_MAX;
    private specialAnimTimeInFrame = SWORD_SPECIAL_ATTACK_TIME;
    private specialAnimCount = this.specialAnimTimeInFrame

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number,
        power = SWORD_DEFAULT_POWER) {
        super(game, x, y, key, frame, power);
    }

    setCoolDown(cd: number) {
        this.coolDownInFrame = cd;
    }

    setAttackFrame(frame: number) {
        this.attackFrame = frame;
        this.attackFrameCountDown = frame;
    }

    weaponUpdate(enemies: Set<Enemy>) {
        super.weaponUpdate(enemies);
        this.game.physics.arcade.overlap(this, Array.from(enemies), this.onOverlapWithEnemy);

        switch (this.attackState) {
            case SwordState.SPECIAL_ATTACK:
                this.specialAttackAnimation();
                return;
            case SwordState.ATTACK:
                this.normalAttackAnimation();
                return;
            case SwordState.SPECIAL_READY:
            case SwordState.READY:
                this.alpha = 1;
                return;
            case SwordState.REST:
            default:
                if (this.killCount > this.specialKillCharge) {
                    this.attackState = SwordState.SPECIAL_READY
                    this.killCount = 0;
                } else {
                    this.alpha = 0.5;
                    this.coolDownCount++;
                    if (this.coolDownCount >= this.coolDownInFrame) {
                        this.attackState = SwordState.READY;
                        this.coolDownCount = 0;
                    }
                }
        }
    }

    normalAttackAnimation() {
        this.alpha = 1;
        this.rotation += 0.5;
        this.attackFrameCountDown--;

        const attackFinished = this.attackFrameCountDown <= 0;
        if (attackFinished) {
            this.damagedEnemy.clear();
            this.attackState = SwordState.REST;
            this.attackFrameCountDown = this.attackFrame;
        }
    }

    specialAttackAnimation() {
        const frame = this.specialAnimTimeInFrame - this.specialAnimCount;
        this.alpha = 1;
        this.specialAnimCount--;
        this.rotation = myAngleBetween(this.owner, this) + this.faceNorthAngle;
        this.scale.x = 3;
        this.scale.y = 3;

        let attackFinished = this.specialAnimCount <= 0;
        if (attackFinished) {
            this.damagedEnemy.clear();
            this.attackState = SwordState.REST;
            this.specialAnimCount = this.specialAnimTimeInFrame;
            this.scale.x = 1;
            this.scale.y = 1;
        }
        return;
    }

    // special attack doesn't charge the sword
    onOverlapWithEnemy(weapon: SwordProtector, enemy: Sprite) {
        super.onOverlapWithEnemy(weapon, enemy);
        switch (weapon.attackState) {
            case SwordState.READY:
                weapon.attackState = SwordState.ATTACK;
                break;
            case SwordState.SPECIAL_READY:
                weapon.attackState = SwordState.SPECIAL_ATTACK;
                break;
        }
        if (weapon.damagedEnemy.has(enemy)) {
            return;
        }
        if (weapon.attackState == SwordState.SPECIAL_ATTACK) {
            enemy.damage(weapon.power * SWORD_SPECIAL_POWER_MULTIPLY);
            weapon.damagedEnemy.add(enemy);
        }
        if (weapon.attackState == SwordState.ATTACK) {
            enemy.damage(weapon.power);
            weapon.damagedEnemy.add(enemy);
            if (!enemy.exists) {
                weapon.killCount++;
            }
        }

        if (!enemy.alive) {
            super.onKillEnemy(weapon, enemy);
        }
    }

    onPowerUpgrade(amount: number) {
        this.power += amount * UPGRADE_SWORD_POWER_AMOUNT;
    }

    private speedUpgradePtr = 0;
    onSpeedUpgrade(amount: number) {
        const upgradeAmount = upgradeAccordingly(UPGRADE_SWORD_SPEED_AMOUNTS, this.speedUpgradePtr);
        this.coolDownInFrame = Math.max(UPGRADE_SWORD_SPEED_MIN, this.coolDownInFrame - upgradeAmount);
        this.speedUpgradePtr += amount;
    }

    onSpecialUpgrade(amount: number) {
        this.specialKillCharge = Math.max(UPGRADE_SWORD_SPECIAL_MIN,
            this.specialKillCharge - UPGRADE_SWORD_SPECIAL_AMOUNT);
    }

    getWeaponInfo(): string {
        let info = super.getWeaponInfo();
        info += "kill charge: " + this.specialKillCharge + '\n'
        info += "current kill count " + this.killCount + '\n'
        info += "\n\n"
        return info
    }

}
