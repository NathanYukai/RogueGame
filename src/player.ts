import 'phaser-ce'
import { Sprite, GameObjectFactory, Key } from 'phaser-ce';

export class Player {
    health : number;
    sprite : Sprite;

    constructor (factory: GameObjectFactory, x:number, y:number, key:string, hp: number = 10){
        this.sprite = factory.sprite(x,y,key);
        this.health = hp;
    }

    move(x: number, y:number): void{
        this.sprite.x += x;
        this.sprite.y += y;
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
        this.move(xMove, yMove);
    }

}
