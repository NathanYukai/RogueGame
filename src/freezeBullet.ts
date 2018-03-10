import * as Phaser from 'phaser-ce'
import { Sprite } from 'phaser-ce';
import { BasicBullet } from './basicBullet';

export class FreezeBullet extends BasicBullet{

    protected spd:number;
    private percent:number;
    private duration:number;
    private range:number;

    constructor(game: Phaser.Game, x:number, y:number, key: string, frame:number,
                percent: number, duration: number, range: number, spd: number, dir: number, ){
        super(game, x, y, key, frame, 1, spd, dir);
        this.percent = percent;
        this.duration = duration;
        this.range = range;
        this.alpha = 0.5;
    }

    public getPercent():number{
        return this.percent;
    }

    public getDuration():number{
        return this.duration;
    }

    public getRange():number{
        return this.range;
    }
}
