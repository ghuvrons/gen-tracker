const Long = require("long");

const EVENT_LIST = [
  { name: "VCU_NET_SOFT_RESET", bit: 0, group: "VCU" },
  { name: "VCU_NET_HARD_RESET", bit: 1, group: "VCU" },
  { name: "VCU_BIKE_FALLEN", bit: 2, group: "VCU" },
  { name: "VCU_REMOTE_MISSING", bit: 3, group: "VCU" },
  { name: "BMS_DISCHARGE_OVER_CURRENT", bit: 30, group: "BMS" },
  { name: "BMS_CHARGE_OVER_CURRENT", bit: 31, group: "BMS" },
  { name: "BMS_SHORT_CIRCUIT", bit: 32, group: "BMS" },
  { name: "BMS_DISCHARGE_OVER_TEMPERATURE", bit: 33, group: "BMS" },
  { name: "BMS_DISCHARGE_UNDER_TEMPERATURE", bit: 34, group: "BMS" },
  { name: "BMS_CHARGE_OVER_TEMPERATURE", bit: 35, group: "BMS" },
  { name: "BMS_CHARGE_UNDER_TEMPERATURE", bit: 36, group: "BMS" },
  { name: "BMS_UNDER_VOLTAGE", bit: 37, group: "BMS" },
  { name: "BMS_OVER_VOLTAGE", bit: 38, group: "BMS" },
  { name: "BMS_OVER_DISCHARGE_CAPACITY", bit: 39, group: "BMS" },
  { name: "BMS_UNBALANCE", bit: 40, group: "BMS" },
  { name: "BMS_SYSTEM_FAILURE", bit: 41, group: "BMS" },
  { name: "BMS_WARNING_OVER_CURRENT", bit: 42, group: "BMS" },
  { name: "BMS_WARNING_OVER_TEMPERATURE", bit: 43, group: "BMS" },
  { name: "BMS_WARNING_UNDER_VOLTAGE", bit: 44, group: "BMS" },
  { name: "BMS_WARNING_UNBALANCE", bit: 45, group: "BMS" },
];

const parseEvent = (value, bit) => {
  return Long.fromNumber(value, 1).shiftRight(bit) & 1;
};

export { EVENT_LIST, parseEvent };
