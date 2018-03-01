import { Pickup } from "./pickup";
import { PlayerWeapon } from "./playerweapon";

export class SpecialPickUp extends Pickup{
    onPickUp(pickup: Pickup, weapon: PlayerWeapon){
        weapon.onSpecialUpgrade(this.power);
    }
}
