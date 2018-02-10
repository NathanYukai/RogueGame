import {Troll} from './troll'
import { GameObjectFactory } from 'phaser-ce';

export class TrollGenerator{
    factory: GameObjectFactory;

    constructor(factory: GameObjectFactory){
        this.factory = factory;
    }

    getOneTroll(x = 100, y = 100): Troll{
        let troll = new Troll(this.factory, x, y, 'troll', 10, 5);
        return troll
    }
}
