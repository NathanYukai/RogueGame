import 'phaser-ce'
import { Sprite, GameObjectFactory } from 'phaser-ce';
import { Player } from './player';

export class Troll {
    health: number;
    power: number;
    sprite: Sprite;

    constructor (factory: GameObjectFactory, x:number, y:number, key:string, hp = 10 , power = 5){
        this.sprite = factory.sprite(x,y,key);
        this.health = hp;
        this.power = power;
    }

    move(x: number, y: number): void{
        this.sprite.x += x;
        this.sprite.y += y;
    }
}
