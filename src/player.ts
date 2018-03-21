import * as Phaser from 'phaser-ce'
import { Sprite, GameObjectFactory, Key, Game, Graphics } from 'phaser-ce';
import { PLAYER_DEFAULT_HP, PLAYER_HP_BAR_MAX_LENGTH } from './config';

export class Player extends Phaser.Sprite {

    private hpBar : Phaser.Graphics

    constructor (game: Phaser.Game, x:number, y:number, key:string, hp: number = PLAYER_DEFAULT_HP){
        super(game, x, y, key);
        this.anchor.setTo(0.5,0.5);
        this.maxHealth = hp;
        this.health = hp;
        this.hpBar = this.game.add.graphics(0,0);

        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    update(){
        this.drawHealthBar();
    }

    drawHealthBar(){
        const percentage = (this.health / this.maxHealth);
        const length =  percentage * PLAYER_HP_BAR_MAX_LENGTH;
        const barX = 100;
        const barY = 550;

        this.hpBar.clear();
        this.hpBar.lineStyle(20,0xFF0000,1);
        this.hpBar.moveTo(barX,barY);
        this.hpBar.lineTo(barX+length, barY)
        this.hpBar.endFill();
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

        this.body.velocity.x = xMove * PLAYER_DEFAULT_HP;
        this.body.velocity.y = yMove * PLAYER_DEFAULT_HP
    }

}
