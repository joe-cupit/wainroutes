import { TerrainLevel } from "@/types/Walk";

export default function estimateWalkTime(
  walkLength: number,
  walkElevation: number,
  walkGradient: TerrainLevel
) {
  const horizontalSpeedKph = {
    1: 2.5,
    2: 3.5,
    3: 4.5,
    4: 5.75,
  };
  const minsPer300m = {
    1: 38,
    2: 34,
    3: 30,
    4: 27,
  };
  const steepnessFix = {
    1: -5,
    2: 0,
    3: 10,
    4: 15,
  };

  const timeStrings = {
    1: "",
    2: "",
    3: "",
    4: "",
  };

  Object.keys(timeStrings).forEach((key) => {
    const speedLevel = Number(key) as 1 | 2 | 3 | 4;

    const horizontalMins = (walkLength / horizontalSpeedKph[speedLevel]) * 60;
    const elevationCorrectionMins =
      (walkElevation / 300) *
      (minsPer300m[speedLevel] + steepnessFix[walkGradient]);

    const totalMins =
      Math.ceil((horizontalMins + elevationCorrectionMins) / 5) * 5;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins - hours * 60;

    timeStrings[speedLevel] = `${
      hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""} ` : ""
    }${mins} mins`;
  });

  return timeStrings;
}
