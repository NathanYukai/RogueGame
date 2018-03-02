import { Pickup } from "./pickup";
import { PlayerWeapon } from "./playerweapon";

export class SpecialPickUp extends Pickup{
    onPickUp(pickup: Pickup, weapon: PlayerWeapon){
        this.destroy();
        weapon.onSpecialUpgrade(this.power);
    }
}
