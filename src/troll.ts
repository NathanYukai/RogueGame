import * as Phaser from 'phaser-ce'
import { Sprite, GameObjectFactory, Game } from 'phaser-ce';
import { Player } from './player';

export class Troll extends Sprite{
    power: number;

    constructor (game: Phaser.Game, x:number, y:number, key:string, hp = 10 , power = 5){
        super(game, x,y, key);
        this.anchor.setTo(0.5,0.5);
        this.power = power;
        this.maxHealth = hp;
        this.health = hp;
        game.add.existing(this);
    }

}

export function sendDamage(troll: Troll, player: Player){
    troll.destroy();
    player.damage(troll.power);
}
