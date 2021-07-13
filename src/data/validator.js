import dayjs from "src/js/dayjs";
import config from "./config";

const readRequest = (v) => v.length == 1 && v === "?";

const GEN = {
  RTC: (v) => dayjs(v, "YYMMDDHHmmss0d", true).isValid(),
};

const NET = {
  SEND_USSD: (v) => v.length < 20 && v.startsWith("*") && v.endsWith("#"),
};

const CON = (v, maxParam, maxParamChar = 30) => {
  if (readRequest(v)) return true;

  const [min, max] = [1, maxParamChar];
  const params = v.split(";");

  if (params.length != maxParam) return;
  for (let i = 0; i < params.length; i++) {
    const len = params[i].length;
    if (len < min || len > max) return;
  }
  return true;
};

const MCU = {
  TEMPLATES: (v) => {
    const max = [32767, 3276];
    const templates = v.split(";");

    if (templates.length != config.mode.drive.length) return;
    for (let i = 0; i < templates.length; i++) {
      const params = templates[i].split(",");

      if (params.length != 2) return;
      for (let j = 0; j < params.length; j++) {
        const val = parseInt(params[j]);

        if (isNaN(val)) return;
        if (val < 1 || val > max[j]) return;
      }
    }
    return true;
  },
};

export default { GEN, NET, CON, MCU };
