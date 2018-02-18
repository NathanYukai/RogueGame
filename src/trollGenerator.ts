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

    getOneTroll(x = this.x, y = this.y, power = this.power, hp = this.hp): Troll{
        let troll = new Troll(this.game, x, y, 'troll', hp, power);
        return troll
    }
}
