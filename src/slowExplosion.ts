import * as Phaser from 'phaser-ce'
import { Sprite, Game } from 'phaser-ce';
import { explodeGroup } from './globals';

export class SlowExplosion extends Sprite{

    private percent:number;
    private duration:number;
    public explosed = false;
    constructor(game: Game, x:number, y:number, key: string, frame: number,
                percent: number, duration: number, radius:number){
        super(game, x, y, key, frame);
        this.percent = percent;
        this.duration = duration;
        this.alpha = 0;
        this.anchor.setTo(0.5,0.5);
        this.height = radius*2;
        this.width = radius*2;
        this.lifespan = 1;
        game.physics.arcade.enable(this);
        game.add.existing(this);

        explodeGroup.add(this)
    }

    kill(): Sprite{
        explodeGroup.delete(this);
        return super.kill();
    }

    getPercent(): number{
        return this.percent;
    }

    getDuration(): number{
        return this.duration;
    }

    getRange(): number{
        return this.height
    }
}
