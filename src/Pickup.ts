import { Sprite } from 'phaser-ce';

export class Pickup extends Sprite{
    private lifeTimeFrame: number;
    constructor(game:Phaser.Game, x:number, y:number, key:string, frame:number, lifeTime:number){
        super(game, x,y,key, frame);
        game.add.existing(this);
        this.lifeTimeFrame = lifeTime;
    }

    update(){
        this.lifeTimeFrame --;
        if(this.lifeTimeFrame < 100){
            this.alpha = this.lifeTimeFrame / 100;
            if(this.lifeTimeFrame % 20 == 0){
                this.alpha = 1;
            }
        }
        if(this.lifeTimeFrame <=0){
            this.destroy();
        }
    }

}
