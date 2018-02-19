import * as Phaser from 'phaser-ce'
import { Sprite, Point } from 'phaser-ce';

export class BasicBullet extends Sprite{

    private power: number;
    private spd: number

    constructor(game: Phaser.Game, x:number, y:number, key: string, frame:number, power=1, spd=20, dir: number){
        super(game, x, y, key, frame)

        this.anchor.setTo(0.5,0.5);
        this.power = power;
        this.spd = spd;
        this.rotation = 3/4 * Math.PI + dir;

        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        game.add.existing(this);
        game.physics.arcade.enable(this);

        let body: Phaser.Physics.Arcade.Body;
        body = this.body;
        body.velocity.x = this.spd * Math.cos(dir);
        body.velocity.y = this.spd * Math.sin(dir)
    }

    public getPower():number {
        return this.power;
    }
}
