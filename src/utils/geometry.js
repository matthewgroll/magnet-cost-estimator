// Volume calculations (all inputs in mm, output in m³)
const mm3_to_m3 = 1e-9;

export function calcVolume(geometry, dims) {
  switch (geometry) {
    case "Block": {
      const { length = 0, width = 0, height = 0 } = dims;
      return length * width * height * mm3_to_m3;
    }
    case "Cylinder": {
      const { diameter = 0, height = 0 } = dims;
      const r = diameter / 2;
      return Math.PI * r * r * height * mm3_to_m3;
    }
    case "Ring": {
      const { od = 0, id = 0, height = 0 } = dims;
      const ro = od / 2, ri = id / 2;
      return Math.PI * (ro * ro - ri * ri) * height * mm3_to_m3;
    }
    case "Arc": {
      // Approximate arc segment: treat as ring sector
      // dims: od, id, height, arc_angle (degrees)
      const { od = 0, id = 0, height = 0, arc_angle = 90 } = dims;
      const ro = od / 2, ri = id / 2;
      const theta = (arc_angle * Math.PI) / 180;
      return 0.5 * (ro * ro - ri * ri) * theta * height * mm3_to_m3;
    }
    default:
      return 0;
  }
}

// Surface area calculations — all inputs in mm, output in cm²
const mm2_to_cm2 = 0.01;

export function calcSurfaceArea(geometry, dims) {
  switch (geometry) {
    case "Block": {
      const { length = 0, width = 0, height = 0 } = dims;
      return 2 * (length * width + length * height + width * height) * mm2_to_cm2;
    }
    case "Cylinder": {
      const { diameter = 0, height = 0 } = dims;
      const r = diameter / 2;
      return (2 * Math.PI * r * height + 2 * Math.PI * r * r) * mm2_to_cm2;
    }
    case "Ring": {
      const { od = 0, id = 0, height = 0 } = dims;
      const ro = od / 2, ri = id / 2;
      // outer lateral + inner lateral + 2 annular end faces
      return (2 * Math.PI * ro * height + 2 * Math.PI * ri * height + 2 * Math.PI * (ro * ro - ri * ri)) * mm2_to_cm2;
    }
    case "Arc": {
      const { od = 0, id = 0, height = 0, arc_angle = 90 } = dims;
      const ro = od / 2, ri = id / 2;
      const theta = (arc_angle * Math.PI) / 180;
      // outer curved face + inner curved face + 2 flat rect sides + 2 annular sector ends
      return (ro * theta * height + ri * theta * height + 2 * (ro - ri) * height + theta * (ro * ro - ri * ri)) * mm2_to_cm2;
    }
    default:
      return 0;
  }
}

export const GEOMETRY_DIMS = {
  Block: [
    { key: "length", label: "Length (mm)", min: 0.1 },
    { key: "width",  label: "Width (mm)",  min: 0.1 },
    { key: "height", label: "Height / Thickness (mm)", min: 0.1 },
  ],
  Cylinder: [
    { key: "diameter", label: "Diameter (mm)", min: 0.1 },
    { key: "height",   label: "Height (mm)",   min: 0.1 },
  ],
  Ring: [
    { key: "od",     label: "OD — Outer Diameter (mm)", min: 0.1 },
    { key: "id",     label: "ID — Inner Diameter (mm)", min: 0.1 },
    { key: "height", label: "Height (mm)",              min: 0.1 },
  ],
  Arc: [
    { key: "od",        label: "OD — Outer Diameter (mm)", min: 0.1 },
    { key: "id",        label: "ID — Inner Diameter (mm)", min: 0.1 },
    { key: "height",    label: "Height (mm)",              min: 0.1 },
    { key: "arc_angle", label: "Arc Angle (°)",            min: 1, max: 360, step: 1, defaultVal: 90 },
  ],
};
