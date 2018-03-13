export function upgradeAccordingly(amounts:number[], ptr:number):number{
    const limitedPtr = Math.min(amounts.length-1, ptr);
    const res = amounts[limitedPtr];
    return res;
}

export const UPGRADE_SWORD_POWER_AMOUNT = 2;
export const UPGRADE_SWORD_SPEED_AMOUNTS = [10,9,8,7,6,5,4,3,2,];
export const UPGRADE_SWORD_SPEED_MIN = 10;
export const UPGRADE_SWORD_SPECIAL_AMOUNT = 1;
export const UPGRADE_SWORD_SPECIAL_MIN = 1;

export const UPGRADE_BASIC_GUN_POWER_AMOUNTS = [4,3,2];
export const UPGRADE_BASIC_GUN_SPEED_AMOUNTS = [10,9,8,7,6,5];
export const UPGRADE_BASIC_GUN_SPEED_MIN = 10;
export const UPGRADE_BASIC_GUN_SPECIAL_AMOUNTS = [15,10,5];

export const UPGRADE_FREEZE_GUN_POWER_AMOUNTS = [0.2,0.1, 0.1, 0.1,0.05];
export const UPGRADE_FREEZE_GUN_POWER_MAX = 0.95;
export const UPGRADE_FREEZE_GUN_SPEED_AMOUNTS = [10,9,8,7,6,5];
export const UPGRADE_FREEZE_GUN_SPEED_MIN = 10;
export const UPGRADE_FREEZE_GUN_SPECIAL_AMOUNT = 5;
