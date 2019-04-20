import * as Phaser from 'phaser-ce'
import { Sprite } from 'phaser-ce';
import { Enemy } from '../Enemies/enemy';
import { myAngleBetween } from '../utils';
import { WEAPON_DISTANCE_INACTIVE, WEAPON_ROTATION_SPD, WEAPON_45_CLOCKWISE_ROTATION, WEAPON_DEFAULT_MANA_COST, WEAPON_DEFAULT_SKILL_COOLDOWN, WEAPON_DEFAULT_SKILL_DURATION } from '../Configs/config';
import { IWeaponOwner } from '../player';

export enum WeaponSkillState {
    ACTIVE,
    INACTIVE
}

export class PlayerWeapon extends Sprite {

    //game play
    protected underDirectControl: boolean;
    protected power: number;
    protected coolDownInFrame: number;
    protected specialLevel = 0;
    protected manaCost: number;
    protected skillCoolDown: number;
    protected skillcdCountDown: number;

    protected skillState: WeaponSkillState;
    protected skillDuration: number;
    protected skillDurationCountDown: number;

    // position and such
    protected owner: IWeaponOwner;
    protected distance = WEAPON_DISTANCE_INACTIVE;
    protected rotateSpd = WEAPON_ROTATION_SPD;
    protected radiusAngleToOwner: number;

    // This is because of the sprite sheet I used, that all weapon is facing north east, 
    // it's logic used by each weapon is a little weird, should fix this later
    protected faceNorthAngle = WEAPON_45_CLOCKWISE_ROTATION;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, power = 5,
        manaCost = WEAPON_DEFAULT_MANA_COST, cd = WEAPON_DEFAULT_SKILL_COOLDOWN, skillDurationInFrame = WEAPON_DEFAULT_SKILL_DURATION) {

        super(game, x, y, key, frame);

        this.underDirectControl = false
        this.anchor.setTo(0.5, 0.5);
        this.power = power;
        this.manaCost = manaCost;
        this.skillCoolDown = cd;
        this.skillcdCountDown = this.skillCoolDown;

        this.skillDuration = skillDurationInFrame;
        this.skillcdCountDown = 0;
        this.skillState = WeaponSkillState.INACTIVE;
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    toggleDirectControl() {
        this.underDirectControl = !this.underDirectControl;
    }

    isUnderDirectControl() {
        return this.underDirectControl;
    }

    getRadiusAngleToOwner() {
        return this.radiusAngleToOwner;
    }

    setRadiusAngleToOwner(angle: number) {
        this.radiusAngleToOwner = angle;
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
        if (this.isUnderDirectControl()) {
            this.pointToCursor();
        } else {
            let angle = this.radiusAngleToOwner;

            angle += this.rotateSpd;
            angle = angle % (2 * Math.PI);
            this.setPosition(angle);
            this.radiusAngleToOwner = angle
        }
    }

    pointToCursor() {
        const mousePosition = this.game.input.mousePointer;
        const angleToPointer = myAngleBetween(this.owner, mousePosition);
        this.setPosition(angleToPointer);
    }

    private setPosition(angle: number) {
        this.x = this.owner.x + this.distance * (Math.cos(angle))
        this.y = this.owner.y + this.distance * (Math.sin(angle))
    }

    getPower(): number {
        return this.power;
    }

    activeSkill() {
        if (
            this.skillcdCountDown != 0 ||
            !this.owner.canActiveWeapon(this.manaCost)
        ) {
            return;
        }
        this.skillcdCountDown = this.skillCoolDown;
        this.skillDurationCountDown = this.skillDuration;
        this.skillState = WeaponSkillState.ACTIVE;
        this.owner.onWeaponActive(this.manaCost);
    }

    weaponUpdate(enemies: Set<Enemy>) {
        this.skillcdCountDown = Math.max(0, this.skillcdCountDown - 1);
        // this.skillDurationCountDown = Math.max(0, this.skillDurationCountDown - 1);
        if (this.skillDurationCountDown <= 0) {
            this.skillState = WeaponSkillState.INACTIVE;
        } else {
            this.skillDurationCountDown = Math.max(0, this.skillDurationCountDown - 1);
        }
        this.followRotate();
    }

    protected onKillEnemy(weapon: PlayerWeapon, enemy: Sprite) {
        weapon.owner.onKillEnemy(enemy);
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
