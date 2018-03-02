import { Sprite } from 'phaser-ce';
import { PlayerWeapon } from './playerweapon';
import { PICKUP_BLINK_START, PICKUP_BLINK_FREQUENT, PICKUP_DROP_ANIME_TIME } from './config';

export class Pickup extends Sprite{
    private lifeTimeFrame: number;
    protected power:number;
    protected dropAnimTimeFrame = PICKUP_DROP_ANIME_TIME;

    constructor(game:Phaser.Game, x:number, y:number, key:string, frame:number, lifeTime:number, power=1){
        super(game, x,y,key, frame);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.lifeTimeFrame = lifeTime;
        this.power = power;
    }

    canBePicked():boolean{
        return this.dropAnimTimeFrame <=0;
    }

    dropLeftAnimation(){
        const count = this.dropAnimTimeFrame;
        if(count<0){
            return;
        }
        
    }

    update(){
        this.lifeTimeFrame --;
        this.dropAnimTimeFrame --;
        if(this.lifeTimeFrame < PICKUP_BLINK_START){
            this.alpha = this.lifeTimeFrame / PICKUP_BLINK_START;
            if(this.lifeTimeFrame % PICKUP_BLINK_FREQUENT == 0){
                this.alpha = 1;
            }
        }
        if(this.lifeTimeFrame <=0){
            this.destroy();
        }
    }

    onPickUp(pickup: Pickup, weapon: PlayerWeapon){
        this.destroy();
    }

}
