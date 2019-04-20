import * as Phaser from 'phaser-ce'
import { PLAYER_DEFAULT_HP, PLAYER_HP_BAR_MAX_LENGTH, PLAYER_DEFAULT_SPEED, PLAYER_DEFAULT_MP } from './Configs/config';

export interface IWeaponOwner extends Phaser.Sprite {
    onWeaponActive: (m: number) => void;
    canActiveWeapon: (m: number) => boolean;
    onKillEnemy: (e: Phaser.Sprite) => void;
}

export class Player extends Phaser.Sprite implements IWeaponOwner {

    private hpBar: Phaser.Graphics;
    private mpBar: Phaser.Graphics;
    private mana: number;
    private maxMana: number;

    constructor(game: Phaser.Game, x: number, y: number, key: string, hp: number = PLAYER_DEFAULT_HP, mp: number = PLAYER_DEFAULT_MP) {
        super(game, x, y, key);
        this.anchor.setTo(0.5, 0.5);
        this.maxHealth = hp;
        this.health = hp;
        this.mana = mp;
        this.maxMana = mp;

        this.hpBar = this.game.add.graphics(0, 0);
        this.mpBar = this.game.add.graphics(0, 0);

        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    update() {
        this.drawHealthBar();
        this.drawMPBar();
    }

    drawHealthBar() {
        const percentage = (this.health / this.maxHealth);
        const length = percentage * PLAYER_HP_BAR_MAX_LENGTH;
        const barX = 100;
        const barY = 550;

        this.hpBar.clear();
        this.hpBar.lineStyle(20, 0xFF0000, 1);
        this.hpBar.moveTo(barX, barY);
        this.hpBar.lineTo(barX + length, barY)
        this.hpBar.endFill();
    }

    drawMPBar() {
        const percentage = (this.mana / this.maxMana);
        const length = percentage * PLAYER_HP_BAR_MAX_LENGTH;
        const barX = 100;
        const barY = 580;

        this.mpBar.clear();
        this.mpBar.lineStyle(20, 0x0000FF, 1);
        this.mpBar.moveTo(barX, barY);
        this.mpBar.lineTo(barX + length, barY)
        this.mpBar.endFill();
    }

    controllPlayer(up: Phaser.Key, down: Phaser.Key, left: Phaser.Key, right: Phaser.Key): void {
        let xMove = 0;
        let yMove = 0;
        if (up.isDown) {
            yMove--;
        } else if (down.isDown) {
            yMove++;
        }

        if (left.isDown) {
            xMove--;
        } else if (right.isDown) {
            xMove++;
        }

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        this.body.velocity.x = xMove * PLAYER_DEFAULT_SPEED;
        this.body.velocity.y = yMove * PLAYER_DEFAULT_SPEED
    }

    canActiveWeapon(cost: number) {
        return this.mana >= cost;
    }

    onWeaponActive(manaCost: number) {
        if (!this.canActiveWeapon(manaCost)) {
            return;
        }
        this.mana = Math.max(0, this.mana - manaCost)
    }

    onKillEnemy(emey: Phaser.Sprite) {
        this.mana = Math.min(this.maxMana, this.mana + 5);
    }

}
