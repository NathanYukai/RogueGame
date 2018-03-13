import * as Phaser from 'phaser-ce'
import { Player } from './player';
import { Troll } from './troll';
import { waveDataDependsOnKillCount, waveDropMap, waveSpeedMap, waveHpMap, waveNumMap } from './utils';
import { TrollGenerator } from './trollGenerator';

export default class EnemyController{

    private game: Phaser.Game;
    private player: Player;
    private trollGenerator: TrollGenerator;

    private trolls: Set<Troll> = new Set();
    private trolls_regular: Set<Troll> = new Set();
    private trolls_formation: Set<Troll> = new Set();

    private trollWaveGapInFrame = 600;
    private trollWaveCount = 0;
    private trollFormationWaveGap = 1200;
    private trollFormationWaveCount = 0;
    totalKillCount: number;

    constructor(game: Phaser.Game, player: Player, generator: TrollGenerator){
        this.game = game;
        this.player = player;
        this.trollGenerator = generator;
        this.totalKillCount = 0;
    }

    update(){
        this.trollWaveCount --;
        this.trollFormationWaveCount --;
        let circleTrolls: Troll[] = [];
        let formationTrolls: Troll[] = [];
        if(this.trollWaveCount<0){
            this.configTrollGenerator();
            const numberOfEnemy = waveDataDependsOnKillCount(waveNumMap, this.totalKillCount);
            circleTrolls = this.trollGenerator.getTrollsInCircle(numberOfEnemy,250);

            this.trollWaveCount = this.trollWaveGapInFrame;
        }
        if(this.trollFormationWaveCount<0){
            this.configTrollGenerator();
            const numberOfEnemy = waveDataDependsOnKillCount(waveNumMap, this.totalKillCount);
            formationTrolls = this.trollGenerator.getTrollsInFormation(5,1,300,100,30);

            this.trollFormationWaveCount= this.trollFormationWaveGap;
        }


        for(let t of circleTrolls){
            this.trolls.add(t);
            this.trolls_regular.add(t);
        }
        for(let t of formationTrolls){
            this.trolls.add(t);
            this.trolls_formation.add(t);
        }

        this.clearDeadEnemies();
        this.trollsMoveToOneDirection(this.trolls_formation, 0, -1);
        this.trollsMoveTowardsPlayer(this.trolls_regular);
    }

    clearDeadEnemies(){
        //qq clear all set of trolls
        for(let t of this.trolls){
            if(! t.exists){
                this.trolls.delete(t);
                this.totalKillCount ++;
            }
        }

        for(let t of this.trolls_regular){
            if(! t.exists){
                this.trolls_regular.delete(t);
            }
        }

        for(let t of this.trolls_formation){
             if(! t.exists){
                this.trolls_regular.delete(t);
            }
        }
    }

    trollsMoveTowardsPlayer(trolls_control: Set<Troll>){
        const arcadePhysics = this.game.physics.arcade;
        for(let troll of trolls_control){
            arcadePhysics.moveToObject(troll, this.player, troll.getSpeedCurrent());
            arcadePhysics.overlap(troll, this.player, troll.onOverlap)
        }
    }

    trollsMoveToOneDirection(trolls_control: Set<Troll>, x:number, y:number){
        if(trolls_control.size == 0){
            return;
        }
        const arcadePhysics = this.game.physics.arcade;
        for(let troll of trolls_control){
            if(! troll.exists){
                continue;
            }
            const spd = troll.getSpeedCurrent();
            const angle = Math.atan2(-y, x);
            const n_x = spd * Math.cos(angle);
            const n_y = spd * Math.sin(angle);

            troll.body.velocity.x = n_x;
            troll.body.velocity.y = n_y;
            arcadePhysics.overlap(troll, this.player, troll.onOverlap)
        }
    }

    configTrollGenerator(){
        const dropChance = waveDataDependsOnKillCount(waveDropMap, this.totalKillCount);
        const speed = waveDataDependsOnKillCount(waveSpeedMap, this.totalKillCount);
        const hp = waveDataDependsOnKillCount(waveHpMap, this.totalKillCount);
        this.trollGenerator.setDropChance(dropChance);
        this.trollGenerator.setSpeed(speed);
        this.trollGenerator.setHp(hp);
    }

    getAllTrolls(){
        return this.trolls;
    }
}
