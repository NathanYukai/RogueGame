import { Pickup } from "./pickup";
import { PlayerWeapon } from "./playerweapon";

export class SpeedPickUp extends Pickup{
    onPickUp(pickup: Pickup, weapon: PlayerWeapon){
        weapon.onSpeedUpgrade(this.power)
    }
}
