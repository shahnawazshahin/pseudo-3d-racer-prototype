export const SEGMENT = {
    LENGTH: 400,
    VISIBILITY: { SHORT: 50, MEDIUM: 100, LONG: 150 }
}

export const COLOUR = {
    GRASS: { LIGHT: 0x205000, DARK: 0x124100 },
    RUMBLE: { LIGHT: 0xc0c0c0, DARK: 0xaa0000 },
    ROAD: { START: 0xc0c0c0, LIGHT: 0x202020, DARK: 0x102010 },
    LANE: { DASH: 0xc0c0c0, GAP: 0x202020 }
}

export const ROAD = {
    WIDTH: { NARROW: 800, MEDIUM: 1600, WIDE: 2400 },
    LENGTH: { NONE: 0, SINGLE: 1, SHORT: 25, MEDIUM: 50, LONG: 100 },
    CURVE: { NONE: 0, EASY_LEFT: -3, MEDIUM_LEFT: -6, HARD_LEFT: -9, EASY_RIGHT: 3, MEDIUM_RIGHT: 6, HARD_RIGHT: 9 },
    CLIMB: { NONE: 0, ACCEND: 6, DECEND: -6 },
    LANES: { SINGLE: 1, DOUBLE: 2, TRIPPLE: 3, QUADRUPLE: 4 }
}

export const OBSTACLE = {
    TYPE: { SIGN_RIGHT: 'sign-right', SIGN_LEFT: 'sign-left', TREE: 'tree', LAMP_POST: 'lamppost' },
    SIDE: { LEFT: -1, NONE: 0, RIGHT: 1 },
    POSITION: { RANDOM: 0, NEAR: 1, MIDDLE: 2, FAR: 3 }
}