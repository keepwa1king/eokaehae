import { Hasher } from "inthash";

export const hasher = new Hasher(
    {
        bits: 53, // Javascript, Number.MAX_SAFE_INTEGER
        prime: "6456111708547433", // Random Prime
        inverse: "3688000043513561", // Modular Inverse
        xor: "969402349590075", // Random n-bit xor mask
    }
);