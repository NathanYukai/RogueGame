import * as Phaser from 'phaser-ce';
import { Physics, Key, Keyboard } from 'phaser-ce';
import { Player } from './player'
import { TrollGenerator } from './Enemies/trollGenerator';
import { PlayerWeapon } from './Weapons/playerweapon';
import { SwordProtector } from './Weapons/SwordProtector/swordProtector'
import { spreadWeaponOnRail, rpgItemSpriteKey } from './utils';
import { rpgItem } from './rpgItemEnum';
import { BasicGun } from './Weapons/BaiscGun/basicGun';
import { FreezeGun } from './Weapons/FreezeGun/freezeGun';
import { pickupGroup, dmgTextGroup, clearGlobalGroups } from './globals';
import EnemyController from './Enemies/enemyController';
import { WEAPON_DISTANCE_INACTIVE, WEAPON_ROTATION_SPD } from './Configs/config';
import _ = require('underscore');

window.onload = function () {

    let trollGenerator: TrollGenerator;
    const game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    let arcadePhysics: Physics.Arcade;

    function preload() {
        game.load.pack('basic', 'assets/spriteReader.json');
    }

    let upKey: Key;
    let downKey: Key;
    let leftKey: Key;
    let rightKey: Key;
    let weaponControlKey: Key;

    let player: Player;
    let weapons: PlayerWeapon[];
    let weaponInfo: Phaser.Text;
    let enemyController: EnemyController;


    let startButton: Phaser.Button;
    let gameStarted: boolean;

    function create() {
        arcadePhysics = game.physics.arcade;
        gameStarted = false;

        const bgColor = '#1a6286';
        const whiteCOlor = '#ffffff';
        game.stage.backgroundColor = whiteCOlor;
        startButton = game.add.button(200, 200, rpgItemSpriteKey, buttonStartGame, undefined,
            rpgItem.ScrollBlue, rpgItem.ScrollRed);

        game.physics.startSystem(Physics.ARCADE);
        weapons = [];
    }

    function buttonStartGame() {
        startButton.kill();
        gameStarted = true;
        gameStartCreate();
        setUpKeys(game.input.keyboard, player);

    }

    function update() {
        if (gameStarted) {
            gameStartUpdate();
        }
    }

    function gameStartCreate() {
        player = new Player(game, game.world.centerX, game.world.centerY, 'human');
        trollGenerator = new TrollGenerator(game);
        enemyController = new EnemyController(game, player, trollGenerator);

        player.alive = true;

        trollGenerator.setStats(player.x, player.y, 10, 5, 30);

        const swordProtector = new SwordProtector(game, player.x, player.y, rpgItemSpriteKey, rpgItem.BasicSword, 10);
        const bow = new BasicGun(game, 0, 10, rpgItemSpriteKey, rpgItem.Bow, 4);
        const slowWand = new FreezeGun(game, 10, 0, rpgItemSpriteKey, rpgItem.Wand, 1);

        bow.toggleDirectControl();
        weapons = [swordProtector, bow, slowWand];
        spreadWeaponOnRail(weapons, player, WEAPON_DISTANCE_INACTIVE, WEAPON_ROTATION_SPD)

        weaponInfo = game.add.text(100, 50, "", { font: '16px' })
    }

    function gameOverClear() {
        gameStarted = false;
        startButton.revive();
        enemyController.clearAllEnemy();
        for (const w of weapons) {
            w.destroy();
        }
        weapons = []

        clearGlobalGroups();
        weaponInfo.destroy();
    }

    function gameStartUpdate() {
        if (!player.alive) {
            gameOverClear();
            return;
        }

        enemyController.update();
        player.update();
        _.map(Array.from(dmgTextGroup), t => t.update());

        //debugWeaponInfo();

        player.controllPlayer(upKey, downKey, leftKey, rightKey);

        if (weaponControlKey.justDown) {
            const curUnderControl = _.findIndex(_.map(weapons, w => w.isUnderDirectControl()), e => e);
            weapons[curUnderControl].toggleDirectControl();
            const next = (curUnderControl + 1) % weapons.length;
            weapons[next].toggleDirectControl();
        }

        checkCollisions()
    }

    function checkCollisions() {
        const allEnemies = enemyController.getAllEnemies();
        _.map(weapons, w => w.weaponUpdate(allEnemies));

        arcadePhysics.collide(Array.from(allEnemies), Array.from(allEnemies))
        for (let pickUp of pickupGroup) {
            arcadePhysics.overlap(pickUp, weapons, pickUp.onPickUp);
        }
    }

    function debugWeaponInfo() {
        const info = weapons[0].getWeaponInfo()
            + weapons[1].getWeaponInfo()
            + weapons[2].getWeaponInfo()
            + 'total kill:' + enemyController.totalKillCount + '\n'
        weaponInfo.text = info;
    }

    function render() {
    }

    function setUpKeys(keyboard: Keyboard, p: Player) {
        upKey = keyboard.addKey(Phaser.Keyboard.W);
        downKey = keyboard.addKey(Phaser.Keyboard.S);
        leftKey = keyboard.addKey(Phaser.Keyboard.A);
        rightKey = keyboard.addKey(Phaser.Keyboard.D);
        weaponControlKey = keyboard.addKey(Phaser.Keyboard.TAB);

    }

};
