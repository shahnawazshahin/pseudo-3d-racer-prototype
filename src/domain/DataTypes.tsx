export type SegmentWorld = {
    x: number,
    y: number,
    z: number,
    curve: number,
    climb: number,
    lanes: number
}

export type SegmentScreen = {
    x: number,
    y: number,
    w: number,
    scale: number,
    turnRate: number,
    climbRate: number
}

export type Obstacle = {
    type: string | null,
    side: number,
    position: number,
    x: number,
    y: number,
    scale: number
}

export type Position = {
    x: number,
    y: number,
    z: number
}

export type ScreenProperties = {
    centreX: number,
    centreY: number,
    height: number,
    width: number
}

export type Colours = {
    grass: number,
    rumble: number,
    road: number,
    lane: number
}