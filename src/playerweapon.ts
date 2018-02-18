import * as Phaser from 'phaser-ce'
import { Sprite } from 'phaser-ce';
import { Player}from './player'
import { Enemy } from './enemy';

export class PlayerWeapon extends Sprite {

    protected owner: Sprite;
    protected rAngle: number;
    protected distance = 100;
    protected rotateSpd = 0.02;
    protected power: number;

    protected faceNorthAngle = 3/4 * Math.PI;

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

    weakRotate(){
        let crtAngle = Math.atan2(this.y - this.owner.y, this.x - this.owner.x);
        let angle = crtAngle + this.rotateSpd;
        this.setPosition(angle);
    }

    private setPosition(angle: number){
        this.x = this.owner.x + this.distance*(Math.cos(angle))
        this.y = this.owner.y + this.distance*(Math.sin(angle))
    }

    getPower():number{
        return this.power;
    }

    weaponUpdate(enemies: Enemy[]){
    }

    onOverlap(weapon:PlayerWeapon, enemy: Sprite){
    }

}
