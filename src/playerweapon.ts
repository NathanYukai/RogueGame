import * as Phaser from 'phaser-ce'
import { Sprite } from 'phaser-ce';
import { Player}from './player'
import { Enemy } from './enemy';
import { WEAPON_DISTANCE, WEAPON_ROTATION_SPD, WEAPON_45_CLOCKWISE_ROTATION } from './config';

export class PlayerWeapon extends Sprite {

    protected owner: Sprite;
    protected rAngle: number;
    protected distance = WEAPON_DISTANCE;
    protected rotateSpd = WEAPON_ROTATION_SPD;
    protected power: number;
    protected coolDownInFrame: number;
    protected specialLevel: number;

    protected faceNorthAngle = WEAPON_45_CLOCKWISE_ROTATION;

    constructor(game: Phaser.Game, x:number, y:number, key:string, frame: number, power = 5){
        super(game, x, y, key, frame);

        this.anchor.setTo(0.5,0.5);
        this.power = power;
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    setOwner(owner: Sprite){
        this.owner = owner;
        this.rAngle = Math.atan2(this.y - owner.y, this.x - owner.x)
    }

    setDistance(distance: number){
        this.distance = distance;
    }

    setRotationSpeed(spd: number){
        this.rotateSpd = spd;
    }

    followRotate(){
        let angle = this.rAngle+ this.rotateSpd;
        this.setPosition(angle);
        this.rAngle = angle
    }

    private setPosition(angle: number){
        this.x = this.owner.x + this.distance*(Math.cos(angle))
        this.y = this.owner.y + this.distance*(Math.sin(angle))
    }

    getPower():number{
        return this.power;
    }

    weaponUpdate(enemies: Set<Enemy>){
    }

    onOverlap(weapon:PlayerWeapon, enemy: Sprite){
    }

    onPowerUpgrade(){
    }

    onSpeedUpgrade(){
    }

    onSpecialUpgrade(){
    }

}
