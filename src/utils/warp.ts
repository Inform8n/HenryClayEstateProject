import { GCPPoint, Bounds, WarpedResult, TransformMethod } from "../types/gis";
import { latLngToWebMercatorMeters, webMercatorMetersToLatLng } from "./coordinates";

/**
 * 2D Affine Matrix Inversion (3x3)
 */
function invert3x3(m: number[][]): number[][] | null {
  const det =
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  if (Math.abs(det) < 1e-14) return null;
  const invDet = 1 / det;

  return [
    [
      (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
      (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
      (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet,
    ],
    [
      (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
      (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
      (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet,
    ],
    [
      (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
      (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
      (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet,
    ],
  ];
}

/**
 * Fit 2D Affine Transformation using Least Squares
 * Maps target (Mercator X, Y) -> source (Pixel U, V)
 */
export function fitAffineTransform(
  sourcePts: [number, number][],
  targetPts: [number, number][]
) {
  const n = sourcePts.length;
  if (n < 3) throw new Error("At least 3 points required for Affine transform");

  let sumX = 0, sumY = 0, sumU = 0, sumV = 0;
  let sumXX = 0, sumYY = 0, sumXY = 0;
  let sumXU = 0, sumYU = 0, sumXV = 0, sumYV = 0;

  for (let i = 0; i < n; i++) {
    const [u, v] = sourcePts[i];
    const [x, y] = targetPts[i];
    sumX += x; sumY += y; sumU += u; sumV += v;
    sumXX += x * x; sumYY += y * y; sumXY += x * y;
    sumXU += x * u; sumYU += y * u;
    sumXV += x * v; sumYV += y * v;
  }

  const M = [
    [sumXX, sumXY, sumX],
    [sumXY, sumYY, sumY],
    [sumX,  sumY,  n   ]
  ];

  const invM = invert3x3(M);
  if (!invM) throw new Error("Collinear or singular control points");

  const a = invM[0][0] * sumXU + invM[0][1] * sumYU + invM[0][2] * sumU;
  const b = invM[1][0] * sumXU + invM[1][1] * sumYU + invM[1][2] * sumU;
  const c = invM[2][0] * sumXU + invM[2][1] * sumYU + invM[2][2] * sumU;

  const d = invM[0][0] * sumXV + invM[0][1] * sumYV + invM[0][2] * sumV;
  const e = invM[1][0] * sumXV + invM[1][1] * sumYV + invM[1][2] * sumV;
  const f = invM[2][0] * sumXV + invM[2][1] * sumYV + invM[2][2] * sumV;

  const residuals: number[] = [];
  let sumSqErr = 0;
  for (let i = 0; i < n; i++) {
    const [u, v] = sourcePts[i];
    const [x, y] = targetPts[i];
    const predU = a * x + b * y + c;
    const predV = d * x + e * y + f;
    const err = Math.sqrt((u - predU) ** 2 + (v - predV) ** 2);
    residuals.push(err);
    sumSqErr += err * err;
  }
  const rmse = Math.sqrt(sumSqErr / n);

  return {
    map: (x: number, y: number): [number, number] => [
      a * x + b * y + c,
      d * x + e * y + f
    ],
    rmse,
    residuals
  };
}

/**
 * Solve linear system A * x = B using Gaussian elimination with partial pivoting
 */
function solveLinearSystem(A: number[][], B: number[]): number[] {
  const n = B.length;
  // Augmented matrix
  const M = A.map((row, i) => [...row, B[i]]);

  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > maxVal) {
        maxVal = Math.abs(M[row][col]);
        maxRow = row;
      }
    }

    if (maxVal < 1e-12) {
      throw new Error("Singular matrix in TPS solver");
    }

    // Swap rows
    if (maxRow !== col) {
      const temp = M[col];
      M[col] = M[maxRow];
      M[maxRow] = temp;
    }

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      const factor = M[row][col] / M[col][col];
      for (let k = col; k <= n; k++) {
        M[row][k] -= factor * M[col][k];
      }
    }
  }

  // Back substitution
  const X = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let sum = M[row][n];
    for (let col = row + 1; col < n; col++) {
      sum -= M[row][col] * X[col];
    }
    X[row] = sum / M[row][row];
  }

  return X;
}

/**
 * Thin-Plate Spline Kernel U(r) = r^2 * ln(r)
 */
function tpsKernel(r2: number): number {
  if (r2 <= 1e-10) return 0;
  return r2 * Math.log(Math.sqrt(r2));
}

/**
 * Fit Thin-Plate Spline Transformation (TPS)
 * Maps target (Mercator X, Y) -> source (Pixel U, V)
 */
export function fitTPSTransform(
  sourcePts: [number, number][],
  targetPts: [number, number][]
) {
  const n = sourcePts.length;
  if (n < 4) {
    // Fall back to affine if fewer than 4 points
    return fitAffineTransform(sourcePts, targetPts);
  }

  const dim = n + 3;
  const L = Array.from({ length: dim }, () => new Array(dim).fill(0));

  // Build K matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        L[i][j] = 0; // Regularization parameter can be added here if needed
      } else {
        const dx = targetPts[i][0] - targetPts[j][0];
        const dy = targetPts[i][1] - targetPts[j][1];
        L[i][j] = tpsKernel(dx * dx + dy * dy);
      }
    }
  }

  // Build P matrix
  for (let i = 0; i < n; i++) {
    const x = targetPts[i][0];
    const y = targetPts[i][1];
    L[i][n] = 1;
    L[i][n + 1] = x;
    L[i][n + 2] = y;

    L[n][i] = 1;
    L[n + 1][i] = x;
    L[n + 2][i] = y;
  }

  // RHS vectors for U and V
  const B_u = new Array(dim).fill(0);
  const B_v = new Array(dim).fill(0);
  for (let i = 0; i < n; i++) {
    B_u[i] = sourcePts[i][0];
    B_v[i] = sourcePts[i][1];
  }

  const weightsU = solveLinearSystem(L, B_u);
  const weightsV = solveLinearSystem(L, B_v);

  const a1_u = weightsU[n], ax_u = weightsU[n + 1], ay_u = weightsU[n + 2];
  const a1_v = weightsV[n], ax_v = weightsV[n + 1], ay_v = weightsV[n + 2];

  const map = (x: number, y: number): [number, number] => {
    let u = a1_u + ax_u * x + ay_u * y;
    let v = a1_v + ax_v * x + ay_v * y;

    for (let i = 0; i < n; i++) {
      const dx = x - targetPts[i][0];
      const dy = y - targetPts[i][1];
      const r2 = dx * dx + dy * dy;
      if (r2 > 1e-10) {
        const k = tpsKernel(r2);
        u += weightsU[i] * k;
        v += weightsV[i] * k;
      }
    }

    return [u, v];
  };

  const residuals: number[] = [];
  let sumSqErr = 0;
  for (let i = 0; i < n; i++) {
    const [predU, predV] = map(targetPts[i][0], targetPts[i][1]);
    const [u, v] = sourcePts[i];
    const err = Math.sqrt((u - predU) ** 2 + (v - predV) ** 2);
    residuals.push(err);
    sumSqErr += err * err;
  }
  const rmse = Math.sqrt(sumSqErr / n);

  return { map, rmse, residuals };
}

/**
 * High-Performance In-Browser Canvas 2D Warper
 */
export async function warpHistoricalMap(
  imageElement: HTMLImageElement,
  gcps: GCPPoint[],
  method: TransformMethod = "affine",
  outputResolution = 1024
): Promise<WarpedResult> {
  const activeGCPs = gcps.filter((g) => g.active);
  if (activeGCPs.length < 3) {
    throw new Error("At least 3 active Ground Control Points are required.");
  }

  const sourcePts: [number, number][] = activeGCPs.map((g) => [g.sourceX, g.sourceY]);
  const targetMercatorMeters: [number, number][] = activeGCPs.map((g) =>
    latLngToWebMercatorMeters(g.targetLat, g.targetLng)
  );

  // Determine Bounding Envelope in Web Mercator meters with 8% padding
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [mx, my] of targetMercatorMeters) {
    minX = Math.min(minX, mx);
    maxX = Math.max(maxX, mx);
    minY = Math.min(minY, my);
    maxY = Math.max(maxY, my);
  }

  const padX = (maxX - minX) * 0.08 || 200;
  const padY = (maxY - minY) * 0.08 || 200;
  minX -= padX; maxX += padX;
  minY -= padY; maxY += padY;

  // Fit transform (Affine or TPS)
  const transform =
    method === "tps" && activeGCPs.length >= 4
      ? fitTPSTransform(sourcePts, targetMercatorMeters)
      : fitAffineTransform(sourcePts, targetMercatorMeters);

  const outW = outputResolution;
  const aspect = (maxY - minY) / (maxX - minX);
  const outH = Math.max(Math.round(outputResolution * aspect), 128);

  // Source image data extraction
  const srcCanvas = document.createElement("canvas");
  const srcW = imageElement.naturalWidth || imageElement.width;
  const srcH = imageElement.naturalHeight || imageElement.height;
  srcCanvas.width = srcW;
  srcCanvas.height = srcH;
  const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true })!;
  srcCtx.drawImage(imageElement, 0, 0);
  const srcImgData = srcCtx.getImageData(0, 0, srcW, srcH);
  const srcPixels = srcImgData.data;

  // Destination canvas creation
  const dstCanvas = document.createElement("canvas");
  dstCanvas.width = outW;
  dstCanvas.height = outH;
  const dstCtx = dstCanvas.getContext("2d", { willReadFrequently: true })!;
  const dstImgData = dstCtx.createImageData(outW, outH);
  const dstPixels = dstImgData.data;

  // Resampling (Mercator -> Source Image)
  // Image rows go top to bottom, whereas Mercator Y increases North (upwards)
  for (let py = 0; py < outH; py++) {
    const my = maxY - (py / outH) * (maxY - minY);
    for (let px = 0; px < outW; px++) {
      const mx = minX + (px / outW) * (maxX - minX);
      const [u, v] = transform.map(mx, my);

      const iu = Math.round(u);
      const iv = Math.round(v);

      const dstIdx = (py * outW + px) * 4;
      if (iu >= 0 && iu < srcW && iv >= 0 && iv < srcH) {
        const srcIdx = (iv * srcW + iu) * 4;
        dstPixels[dstIdx] = srcPixels[srcIdx];         // R
        dstPixels[dstIdx + 1] = srcPixels[srcIdx + 1]; // G
        dstPixels[dstIdx + 2] = srcPixels[srcIdx + 2]; // B
        dstPixels[dstIdx + 3] = srcPixels[srcIdx + 3]; // A
      } else {
        dstPixels[dstIdx + 3] = 0; // Transparent
      }
    }
  }

  dstCtx.putImageData(dstImgData, 0, 0);

  // Convert bounding box back to Lat/Lng (WGS84)
  const [swLat, swLng] = webMercatorMetersToLatLng(minX, minY);
  const [neLat, neLng] = webMercatorMetersToLatLng(maxX, maxY);

  const residuals = activeGCPs.map((gcp, i) => ({
    id: gcp.id,
    error: Math.round(transform.residuals[i] * 100) / 100
  }));

  return {
    dataUrl: dstCanvas.toDataURL("image/png"),
    bounds: {
      southWest: [swLat, swLng],
      northEast: [neLat, neLng]
    },
    rmse: Math.round(transform.rmse * 100) / 100,
    residuals
  };
}
