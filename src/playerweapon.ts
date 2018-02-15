import * as Phaser from 'phaser-ce'
import { Sprite } from 'phaser-ce';
import { Player}from './player'

export class PlayerWeapon extends Sprite {

    owner: Sprite;
    angle: number;
    distance: number;
    rotateSpd: number;

    constructor(game: Phaser.Game, x:number, y:number, key:string, distance = 100, rotateSpd = 0.02){
        super(game, x, y, key);

        this.anchor.setTo(0.5,0.5);
        this.distance = distance;
        this.rotateSpd = rotateSpd;
        game.add.existing(this);
    }

    setOwner(owner: Sprite){
        this.owner = owner;
        this.angle = Math.atan2(this.y - owner.y, this.x - owner.x)
    }

    setDistance(distance: number){
        this.distance = distance;
    }

    setRotationSpeed(spd: number){
        this.rotateSpd = spd;
    }

    followRotate(){
        let angle = this.angle+ this.rotateSpd;
        this.setPosition(angle);
        this.angle = angle
    }

    relativeRotate(){
        let crtAngle = Math.atan2(this.y - this.owner.y, this.x - this.owner.x);
        let angle = crtAngle + this.rotateSpd;
        this.setPosition(angle);
    }

    private setPosition(angle: number){
        this.x = this.owner.x + this.distance*(Math.cos(angle))
        this.y = this.owner.y + this.distance*(Math.sin(angle))
    }

}
