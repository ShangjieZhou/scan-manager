// types of readings
export const BARTYPE = {
  BONE_QUALITY: "bone-quality",
  SPINAL_DEFORMITY: "spinal-deformity",
  SPINAL_MOBILITY: "spinal-mobility",
}

// upper and lower bounds for each reading
export const bounds = {
  [BARTYPE.BONE_QUALITY]: [30, 70],
  [BARTYPE.SPINAL_DEFORMITY]: [30, -10],
  [BARTYPE.SPINAL_MOBILITY]: [-5, 35],
}

// how much portion each color takes up
export const portions = {
  [BARTYPE.BONE_QUALITY]: [1, 1, 2],
  [BARTYPE.SPINAL_DEFORMITY]: [1, 1, 2],
  [BARTYPE.SPINAL_MOBILITY]: [1, 1, 2],
}

// color spec for each reading interval
export const colors = {
  red: "red",
  yellow: "rgb(246, 171, 31)",
  green: "green",
}
