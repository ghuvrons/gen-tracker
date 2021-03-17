const EVENT_LIST = [
  { group: "VCU", bit: 0, name: "VCU_NET_SOFT_RESET" },
  { group: "VCU", bit: 1, name: "VCU_NET_HARD_RESET" },
  { group: "VCU", bit: 2, name: "VCU_REMOTE_MISSING" },
  { group: "VCU", bit: 3, name: "VCU_BIKE_FALLEN" },
  { group: "VCU", bit: 4, name: "VCU_BIKE_MOVED" },

  { group: "BMS", bit: 50, name: "BMS_DISCHARGE_OVER_CURRENT" },
  { group: "BMS", bit: 51, name: "BMS_CHARGE_OVER_CURRENT" },
  { group: "BMS", bit: 52, name: "BMS_SHORT_CIRCUIT" },
  { group: "BMS", bit: 53, name: "BMS_DISCHARGE_OVER_TEMPERATURE" },
  { group: "BMS", bit: 54, name: "BMS_DISCHARGE_UNDER_TEMPERATURE" },
  { group: "BMS", bit: 55, name: "BMS_CHARGE_OVER_TEMPERATURE" },
  { group: "BMS", bit: 56, name: "BMS_CHARGE_UNDER_TEMPERATURE" },
  { group: "BMS", bit: 57, name: "BMS_UNDER_VOLTAGE" },
  { group: "BMS", bit: 58, name: "BMS_OVER_VOLTAGE" },
  { group: "BMS", bit: 59, name: "BMS_OVER_DISCHARGE_CAPACITY" },
  { group: "BMS", bit: 60, name: "BMS_UNBALANCE" },
  { group: "BMS", bit: 61, name: "BMS_SYSTEM_FAILURE" },
];

export { EVENT_LIST };
