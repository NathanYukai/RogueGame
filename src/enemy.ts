import * as Phaser from 'phaser-ce'
import { Sprite, Physics } from 'phaser-ce';

export class Enemy extends Sprite{
    private power:number;
    private slowedDuration: number = 0;
    private slowedPercentage: number = 0;
    private speed: number = 50;

    constructor (game: Phaser.Game, x:number, y:number, key:string, hp=10, power=5){
        super(game, x, y, key);
        this.anchor.setTo(0.5,0.5);
        this.power = power;
        this.health = hp;
        this.maxHealth = hp;

        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    getSpeedCurrent():number{
        return this.speed * (1- this.slowedPercentage);
    }

    getPower():number {
        return this.power;
    }

    getSlowed(percentage:number, duration:number){
        this.slowedDuration = duration;
        if(percentage> this.slowedPercentage){
            this.slowedPercentage = percentage;
        }
    }

    update() {
        if(this.slowedDuration>0){
            this.slowedDuration --;
        }

        if(this.slowedDuration <= 0){
            this.slowedPercentage = 0;
        }
    }
}
