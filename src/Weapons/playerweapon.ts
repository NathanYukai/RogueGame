import * as Phaser from 'phaser-ce'
import { Sprite } from 'phaser-ce';
import { Enemy } from '../Enemies/enemy';
import { myAngleBetween } from '../utils';
import { WEAPON_DISTANCE, WEAPON_ROTATION_SPD, WEAPON_45_CLOCKWISE_ROTATION } from '../Configs/config';
import { IWeaponOwner } from '../player';
import { RotationDirection } from './rrotationDirection';

export class PlayerWeapon extends Sprite {

    protected owner: IWeaponOwner;
    protected distance = WEAPON_DISTANCE;
    protected rotateSpd = WEAPON_ROTATION_SPD;
    protected power: number;
    protected coolDownInFrame: number;
    protected specialLevel = 0;
    private radiusAngleToOwner: number;

    // This is because of the sprite sheet I used, that all weapon is facing north east, 
    // it's logic used by each weapon is a little weird, should fix this later
    protected faceNorthAngle = WEAPON_45_CLOCKWISE_ROTATION;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, power = 5) {
        super(game, x, y, key, frame);

        this.anchor.setTo(0.5, 0.5);
        this.power = power;
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    setOwner(owner: IWeaponOwner) {
        this.owner = owner;
        this.radiusAngleToOwner = myAngleBetween(this, owner);
    }

    setDistance(distance: number) {
        this.distance = distance;
    }

    setRotationSpeed(spd: number) {
        this.rotateSpd = spd;
    }

    followRotate() {
        let angle = this.radiusAngleToOwner;
        switch (this.owner.rotationDir) {
            case RotationDirection.AntiClock:
                angle = (angle - this.rotateSpd);
                break;
            case RotationDirection.ClockWise:
                angle = (angle + this.rotateSpd);
                break;
        }
        angle = angle % (2 * Math.PI);
        this.setPosition(angle);
        this.radiusAngleToOwner = angle
    }

    private setPosition(angle: number) {
        this.x = this.owner.x + this.distance * (Math.cos(angle))
        this.y = this.owner.y + this.distance * (Math.sin(angle))
    }

    getPower(): number {
        return this.power;
    }

    weaponUpdate(enemies: Set<Enemy>) {
    }

    onOverlapWithEnemy(weapon: PlayerWeapon, enemy: Sprite) {
    }

    onPowerUpgrade(amount: number) {
    }

    onSpeedUpgrade(amount: number) {
    }

    onSpecialUpgrade(amount: number) {
    }

    getWeaponInfo(): string {
        let info = '';
        info += "weapon: " + this.name;
        info += "power: " + this.power + '\n'
        info += "coolDown: " + this.coolDownInFrame + '\n'
        return info;
    }
}
