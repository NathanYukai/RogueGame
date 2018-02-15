import {Troll} from './troll'
import * as Phaser from 'phaser-ce';

export class TrollGenerator{
    game: Phaser.Game;

    constructor(game: Phaser.Game){
        this.game = game;
    }

    getOneTroll(x = 100, y = 100): Troll{
        let troll = new Troll(this.game, x, y, 'troll', 10, 5);
        return troll
    }
}
