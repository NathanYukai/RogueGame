import { Pickup } from "./ppickup";
import { PlayerWeapon } from "./Weapons/playerweapon";

export class PowerPickUp extends Pickup {

    onPickUp(pickup: Pickup, weapon: PlayerWeapon) {
        if (pickup.canBePicked()) {
            pickup.destroy();
            weapon.onPowerUpgrade(pickup.getPower());
        }
    }
}
