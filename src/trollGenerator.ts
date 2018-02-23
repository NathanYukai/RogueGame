import {Troll} from './troll'
import * as Phaser from 'phaser-ce';

export class TrollGenerator{
    game: Phaser.Game;

    x= 100;
    y= 100;
    hp= 10;
    power= 5;

    constructor(game: Phaser.Game){
        this.game = game;
    }

    setStats(x:number, y:number, hp:number, power:number){
        this.x = x;
        this.y = y;
        this.hp = hp,
        this.power = power;
    }

    getOneTroll(x = this.x, y = this.y, power = this.power, hp = this.hp): Troll{
        let troll = new Troll(this.game, x, y, 'troll', hp, power);
        return troll
    }

    getTrollsInCircle(x = this.x, y = this.y, power = this.power, num: number, r: number): Troll[]{
        let res = [];
        let angleGap = 2*Math.PI / num;
        for(let i = 0; i< num; i++){
            let tx = x + r*Math.cos(angleGap * i);
            let ty = y + r*Math.sin(angleGap * i);
            res.push(new Troll(this.game, tx, ty, 'troll', this.hp, power))
        }

        return res;
    }
}
