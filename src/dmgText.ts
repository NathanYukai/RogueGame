import * as Phaser from 'phaser-ce'
import { Text } from 'phaser-ce';
import { dmgTextGroup } from './globals';
import { DMG_TEXT_LIFE_TIME } from './Configs/config';

export class DmgText extends Text {
    private lifeTimeFrame = DMG_TEXT_LIFE_TIME;

    constructor(game: Phaser.Game, x: number, y: number, msg: string) {
        super(game, x, y, msg, { font: '16px Arial', fill: '#FF5733' })
        dmgTextGroup.add(this);
        game.add.existing(this);
        this.z = 100;
    }

    update() {
        const y_displ = 0.5;
        this.lifeTimeFrame--;
        if (this.lifeTimeFrame < 0) {
            this.destroy();
        }
        this.y -= y_displ;
    }

    destroy() {
        dmgTextGroup.delete(this);
        super.destroy();
    }
}
