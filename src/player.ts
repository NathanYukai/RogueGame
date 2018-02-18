import * as Phaser from 'phaser-ce'
import { Sprite, GameObjectFactory, Key, Game } from 'phaser-ce';

export class Player extends Phaser.Sprite {
    constructor (game: Phaser.Game, x:number, y:number, key:string, hp: number = 100){
        super(game, x, y, key);
        this.anchor.setTo(0.5,0.5);
        this.maxHealth = hp;
        this.health = hp;

        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    controllPlayer(up: Key, down: Key, left: Key, right: Key): void{
        let xMove = 0;
        let yMove = 0;
        if(up.isDown){
            yMove --;
        }else if(down.isDown){
            yMove ++;
        }

        if(left.isDown){
            xMove --;
        }else if(right.isDown){
            xMove ++;
        }

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        this.body.velocity.x = xMove * 200;
        this.body.velocity.y = yMove * 200
    }

}
