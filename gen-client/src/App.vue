<template>
    <div id="q-app">
        <router-view />
    </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";

import { ACK } from "./utils/ack";
import { Header } from "./utils/frame";
import { config } from "./utils/config";
import { CRC32, AsciiToHex } from "./utils/helper";

export default {
    // name: "App",
    created() {
        this.$root.$on("sendCommand", this.sendCommand);
    },
    destroyed() {
        this.$root.$off("sendCommand", this.sendCommand);
    },
    computed: {
        ...mapState("app", ["config", "loading"]),
        ...mapState("database", ["theCommand"]),
        ...mapGetters("database", ["uniqueReport", "getClientByUnitId"]),
    },
    methods: {
        ...mapMutations("database", ["ADD_UNITS"]),
        getField(header, field) {
            return header.find((el) => el.field === field);
        },
        calculatePayloadCRC(hexData) {
            // calculate size of crcHeader
            let crcSize = Header.filter(({ field }) =>
                ["prefix", "crc"].includes(field)
            )
                .map(({ size }) => size)
                .reduce((sum, val) => sum + val);
            // calculate the crc
            return CRC32(hexData.substring(crcSize * 2));
        },
        parseHeader(hexData) {
            // get header field for header and frame decision
            let elCursor = 0;
            let header = [];
            // parse frame by header
            Header.forEach((el) => {
                let valFormat = el.format(
                    hexData.substr(elCursor, el.size * 2)
                );
                // update cursor position
                elCursor += el.size * 2;
                // fill data
                header.push({
                    ...el,
                    value: valFormat,
                    output: el.display(valFormat),
                });
            });
            return header;
        },
        validateFrame(hexData) {
            // calculate minimum data size for header
            let headerSize = Header.map(({ size }) => size).reduce(
                (sum, val) => sum + val
            );
            // check minimum data size
            if (hexData.length <= headerSize * 2) {
                console.warn(`CORRUPT: Bellow minimum size`);
                return false;
            }

            // parse header
            let header = this.parseHeader(hexData);
            // validate by prefix, crc and size
            let prefix = this.getField(header, "prefix");
            if (prefix.value !== this.config.frame.prefix) {
                console.warn(`CORRUPT: Prefix not same`);
                return false;
            }
            // validate CRC
            let crc = this.getField(header, "crc");
            if (crc.output !== this.calculatePayloadCRC(hexData)) {
                console.warn(`CORRUPT: CRC not valid`);
                return false;
            }
            // validate Size
            let size = this.getField(header, "size");
            let unCalculatedSize = prefix.size + crc.size + size.size;
            if (size.value !== hexData.length / 2 - unCalculatedSize) {
                console.warn(`CORRUPT: Size not same`);
                return false;
            }
            return header;
        },
        sendCommand({ client, type, hex }) {
            this.$socket.emit("send", {
                client,
                type,
                hex,
            });
        },
        showLoadingCommand() {
            let { timeout, cmd } = this.theCommand;
            this.$root.$emit("waitCommand", timeout);
            // check is FINGER_ADD
            if (cmd.ref.command === "FINGER_ADD") {
                this.$root.$emit("scanningDialog");
            }
        },
        // buildACK(frameID, sequentialID) {
        //     let hex = "";
        //     ACK.forEach((_, i) => {
        //         let { field, format } = ACK[ACK.length - 1 - i];
        //         switch (field) {
        //             case "sequentialID":
        //                 hex = format(sequentialID) + hex;
        //                 break;
        //             case "frameID":
        //                 hex = format(frameID) + hex;
        //                 break;
        //             case "prefix":
        //                 hex = format() + hex;
        //                 break;
        //             default:
        //                 break;
        //         }
        //     });
        //     return hex.toUpperCase();
        // },
        // buildNACK() {
        //     let hex = AsciiToHex(config.nack.prefix);
        //     return hex.toUpperCase();
        // },
    },
    sockets: {
        connected: function () {
            let { socket } = this.config;
            this.$q.notify({
                message: `Connected to Socket Server ${socket.address}:${socket.port}`,
            });
        },
        frameReceived: function (res) {
            let { hexData, client } = res;

            // validate frame
            let header = this.validateFrame(hexData);
            if (!header) {
                console.error(`CORRUPT ${hexData}`);
                return;
            }

            // frame is valid
            // add unit (if not exist)
            let unitID = this.getField(header, "unitID").value;
            this.ADD_UNITS({
                unitID,
                client,
            });

            // handle to corresponding
            let frameID = this.getField(header, "frameID").value;
            let sequentialID = this.getField(header, "sequentialID").value;
            if (frameID === this.config.frame.id.RESPONSE) {
                // response frame
                console.log(`RESPONSE-${sequentialID} ${hexData}`);
                // handle response
                this.$root.$emit("handleResponse", { hexData });
            } else {
                // report frame
                console.log(`REPORT-${sequentialID} ${hexData}`);
                // if duplicate discard
                if (!this.uniqueReport(unitID, sequentialID)) {
                    console.warn("ABOVE IS DUPLICATE!!");
                    return;
                }
                // handle report
                this.$root.$emit("handleReport", {
                    hexData,
                    frameID,
                });
            }

            // let reply = null;
            // let type = "ACK";
            // // prepare ACK
            // reply = this.buildACK(frameID, sequentialID);
            // // reply the REPORT frame
            // this.sendCommand({
            //     client,
            //     type: reply ? type : "NACK",
            //     hex: reply || this.buildNACK(),
            // });
        },
    },
    watch: {
        "theCommand.hex": function (val) {
            if (val) {
                let client = this.getClientByUnitId(this.theCommand.unitID);

                if (client) {
                    this.sendCommand({
                        client,
                        type: "COMMAND",
                        hex: val,
                    });

                    // send command, wait response
                    this.showLoadingCommand();
                }
            }
        },
    },
};
</script>

<style>
</style>
