import {Troll} from './troll'
import * as Phaser from 'phaser-ce';

export class TrollGenerator{
    game: Phaser.Game;

    x= 100;
    y= 100;
    private hp= 10;
    private power= 5;
    private dropChance = 10;

    constructor(game: Phaser.Game){
        this.game = game;
    }

    setStats(x:number, y:number, hp:number, power:number, dropChance:number){
        this.x = x;
        this.y = y;
        this.hp = hp,
        this.power = power;
        this.dropChance = dropChance;
    }

    setHp(hp:number){
        this.hp = hp;
    }

    setDropChance(dc: number){
        this.dropChance = dc;
    }

    getOneTroll(x:number, y:number): Troll{
        let troll = new Troll(this.game, x, y, 'troll', this.hp, this.power, this.dropChance);
        return troll
    }

    getTrollsInCircle(num: number, r: number): Troll[]{
        let res = [];
        let angleGap = 2*Math.PI / num;
        for(let i = 0; i< num; i++){
            let tx = this.x + r*Math.cos(angleGap * i);
            let ty = this.y + r*Math.sin(angleGap * i);
            const troll = new Troll(this.game, tx, ty, 'troll', this.hp, this.power, this.dropChance)
            res.push(troll)
        }

        return res;
    }
}
