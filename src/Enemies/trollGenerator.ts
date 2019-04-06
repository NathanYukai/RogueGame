import { Troll } from './troll'
import * as Phaser from 'phaser-ce';
import { ENEMY_DEFAULT_SPEED, ENEMY_FORMATATION_LIFE_SPAN } from '../Configs/config';

export class TrollGenerator {
    game: Phaser.Game;

    x = 100;
    y = 100;
    private hp = 10;
    private power = 5;
    private dropChance = 10;
    private speed = ENEMY_DEFAULT_SPEED

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    setStats(x: number, y: number, hp: number, power: number, dropChance: number) {
        this.x = x;
        this.y = y;
        this.hp = hp,
            this.power = power;
        this.dropChance = dropChance;
    }

    setHp(hp: number) {
        this.hp = hp;
    }

    setDropChance(dc: number) {
        this.dropChance = dc;
    }

    setSpeed(sp: number) {
        this.speed = sp;
    }

    getOneTroll(x: number, y: number): Troll {
        let troll = new Troll(this.game, x, y, 'troll', this.hp, this.power, this.dropChance, this.speed);
        return troll
    }

    getTrollsInCircle(num: number, r: number): Troll[] {
        let res = [];
        let angleGap = 2 * Math.PI / num;
        for (let i = 0; i < num; i++) {
            let tx = this.x + r * Math.cos(angleGap * i);
            let ty = this.y + r * Math.sin(angleGap * i);
            const troll = new Troll(this.game, tx, ty, 'troll', this.hp, this.power, this.dropChance, this.speed)
            res.push(troll)
        }

        return res;
    }

    getTrollsInFormation(width: number, height: number, x_topL: number, y_topL: number, gap: number): Troll[] {
        let res = []
        const spriteWidth = 16;
        const spriteHeight = 16;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const x = x_topL + j * (spriteWidth + gap);
                const y = y_topL + i * (spriteHeight + gap);
                const troll = new Troll(this.game, x, y, 'troll',
                    this.hp, this.power, this.dropChance, this.speed)
                troll.lifespan = ENEMY_FORMATATION_LIFE_SPAN;
                res.push(troll)
            }
        }

        return res;
    }
}
