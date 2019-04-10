import { Sprite } from 'phaser-ce';
import { PlayerWeapon } from './Weapons/playerweapon';
import { pickupGroup } from './globals';
import { PICKUP_DROP_ANIME_TIME, PICKUP_BLINK_START, PICKUP_BLINK_FREQUENT } from './Configs/config';

export class Pickup extends Sprite {
    private lifeTimeFrame: number;
    private dropAnimTimeFrame = PICKUP_DROP_ANIME_TIME;
    private canBePickCountDown = PICKUP_DROP_ANIME_TIME * 1.5;
    private origin_y: number;
    protected power: number;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, lifeTime: number, power = 1) {
        super(game, x, y, key, frame);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.lifeTimeFrame = lifeTime;
        this.power = power;
        this.origin_y = y;
    }

    canBePicked(): boolean {
        return this.canBePickCountDown < 0;
    }

    dropLeftAnimation() {
        const count = this.dropAnimTimeFrame;
        const peak = PICKUP_DROP_ANIME_TIME / 3;
        if (count < 0) {
            return;
        }
        const y_dis = 0.3;
        const x_dis = 0.5;
        this.x -= x_dis;
        if (count < peak) {
            this.y += y_dis;
        } else {
            this.y -= y_dis;
        }
    }

    update() {
        this.lifeTimeFrame--;
        this.dropAnimTimeFrame--;
        this.canBePickCountDown--;

        this.dropLeftAnimation();
        if (this.lifeTimeFrame < PICKUP_BLINK_START) {
            this.alpha = this.lifeTimeFrame / PICKUP_BLINK_START;
            if (this.lifeTimeFrame % PICKUP_BLINK_FREQUENT == 0) {
                this.alpha = 1;
            }
        }
        if (this.lifeTimeFrame <= 0) {
            this.destroy();
        }
    }

    getPower(): number {
        return this.power;
    }

    onPickUp(pickup: Pickup, weapon: PlayerWeapon) {
        this.destroy();
    }

    destroy() {
        pickupGroup.delete(this);
        super.destroy();
    }

}
