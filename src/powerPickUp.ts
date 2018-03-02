import { Pickup } from "./pickup";
import { PlayerWeapon } from "./playerweapon";

export class PowerPickUp extends Pickup{

    onPickUp(pickup: Pickup, weapon: PlayerWeapon){
        pickup.destroy();
        weapon.onPowerUpgrade(this.power);
    }
}
