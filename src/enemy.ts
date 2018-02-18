import * as Phaser from 'phaser-ce'
import { Sprite, Physics } from 'phaser-ce';

export class Enemy extends Sprite{
    private power:number;

    constructor (game: Phaser.Game, x:number, y:number, key:string, hp=10, power=5){
        super(game, x, y, key);
        this.anchor.setTo(0.5,0.5);
        this.power = power;
        this.health = hp;
        this.maxHealth = hp;

        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    getPower():number {
        return this.power;
    }
}
