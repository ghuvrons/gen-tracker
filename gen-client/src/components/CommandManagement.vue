<template>
    <div class="shadow-1">
        <p class="q-pa-sm q-mb-none">
            Command Management
            <q-btn
                v-if="cmd.list.length"
                icon="info"
                color="primary"
                dense
                round
                flat
                @click="modal.open = true"
            ></q-btn>
        </p>
        <q-field
            class="q-pa-sm bg-white"
            helper="Press ENTER to send, or see the docs."
        >
            <q-input
                v-model="cmd.payload"
                stack-label="Input Command:"
                upper-case
                :color="theCommand ? 'red' : 'primary'"
                type="text"
                :disable="loading || !theUnit"
                :readonly="loading"
                :loading="loading"
                @keyup.enter="executeCommand({ payload: cmd.payload })"
                :after="[
                    {
                        icon: 'send',
                        content: true,
                        handler() {
                            executeCommand({ payload: cmd.payload });
                        }
                    }
                ]"
            />
        </q-field>

        <q-modal
            v-model="modal.open"
            :content-css="{ minWidth: '80vw', minHeight: '80vh' }"
        >
            <q-modal-layout>
                <q-toolbar slot="header">
                    <q-btn
                        flat
                        round
                        dense
                        v-close-overlay
                        icon="keyboard_arrow_left"
                    />
                    <q-toolbar-title>
                        Command List
                        <q-chip color="red" dense square>{{
                            cmd.list.length
                        }}</q-chip>
                    </q-toolbar-title>
                </q-toolbar>

                <q-toolbar slot="header">
                    <q-search
                        class="fit"
                        inverted
                        autofocus
                        v-model="modal.search"
                        color="none"
                    />
                </q-toolbar>

                <q-toolbar slot="footer">
                    <q-toolbar-title class="q-pa-xs">
                        <q-btn
                            color="primary"
                            @click="modal.open = false"
                            label="Close"
                        />
                    </q-toolbar-title>
                </q-toolbar>

                <div class="layout-padding">
                    <q-list link separator>
                        <q-item
                            v-for="(el, i) in searchResult"
                            :key="i"
                            @click.native="
                                selectCommandRefference(
                                    el.exCommand ? el.exCommand : el.command
                                )
                            "
                        >
                            <q-item-main>
                                <q-item-tile label>{{
                                    el.command
                                }}</q-item-tile>
                                <q-item-tile sublabel>{{
                                    el.desc
                                }}</q-item-tile>

                                <q-item-tile sublabel>
                                    <q-chip dense square color="red">
                                        {{
                                            el.exCommand
                                                ? el.exCommand
                                                : el.command
                                        }}
                                    </q-chip>
                                </q-item-tile>
                                <q-item-tile sublabel>
                                    <q-chip dense square color="green">
                                        {{ el.exDesc ? el.exDesc : el.desc }}
                                    </q-chip>
                                </q-item-tile>
                            </q-item-main>
                            <q-item-side right v-if="el.type">
                                <q-item-tile>
                                    <q-chip dense square color="blue">{{
                                        el.type
                                    }}</q-chip>
                                </q-item-tile>
                                <q-item-tile>
                                    <q-chip dense square color="blue">{{
                                        el.range
                                    }}</q-chip>
                                </q-item-tile>
                            </q-item-side>
                        </q-item>
                    </q-list>
                </div>
            </q-modal-layout>
        </q-modal>
    </div>
</template>

<script>
import { FlowFilter } from "components/js/helper";
import {
    Command,
    CommandList,
    CommandResponse,
    Response
} from "components/js/command";
import { mapState, mapMutations } from "vuex";

export default {
    // name: 'ComponentName',
    created() {
        this.$root.$on("setCommand", this.setCommand);
        this.$root.$on("executeCommand", this.executeCommand);
        this.$root.$on("startWaitting", this.startWaitting);
        this.$root.$on("handleResponse", this.handleResponse);
    },
    destroyed() {
        this.$root.$off("setCommand", this.setCommand);
        this.$root.$off("executeCommand", this.executeCommand);
        this.$root.$off("startWaitting", this.startWaitting);
        this.$root.$off("handleResponse", this.handleResponse);
    },
    data() {
        return {
            cmd: {
                payload: "",
                list: this.$_.cloneDeep(CommandList)
            },
            modal: {
                open: false,
                height: 300,
                search: ""
            },
            dismiss: null
        };
    },
    computed: {
        ...mapState("database", ["loading", "config", "theUnit", "theCommand"]),
        searchResult() {
            return FlowFilter(this.cmd.list, this.modal.search);
        }
    },
    methods: {
        ...mapMutations("database", [
            "SET_LOADING",
            "CLEAR_THE_COMMAND",
            "SET_THE_COMMAND",
            "ADD_FINGERS",
            "DELETE_FINGERS",
            "RESET_FINGERS",
            "ADD_RESPONSES"
        ]),
        timeoutCommand() {
            let code = CommandResponse.find(el => el.name === "timeout");
            // save response
            this.saveResponse({
                unitID: this.theUnit.unitID,
                data: null,
                hexData: null,
                payload: this.theCommand.payload,
                code,
                message: ""
            });
            // dismiss loading notifcation
            this.stopWaitting("Command timeout.", "negative");
        },
        startWaitting(timeout) {
            // prepare payload to send
            this.SET_LOADING(true);
            // timeout guard
            this.timers.timeoutCommand.time =
                timeout || this.config.command.timeoutMS;
            this.$timer.start("timeoutCommand");
            // show notification about sending command
            this.dismiss = this.$q.notify({
                message: "Sending command....",
                timeout: 0
            });
        },
        stopWaitting(message, type) {
            // clear buffer
            this.CLEAR_THE_COMMAND();
            // hide any loading
            this.SET_LOADING(false);
            this.$q.loading.hide();
            this.dismiss();
            // stop timer
            if (this.timers.timeoutCommand.isRunning) {
                this.$timer.stop("timeoutCommand");
            }
            // show notification result
            this.$q.notify({
                message,
                type
            });
        },
        selectCommandRefference(payload) {
            this.modal.open = false;
            this.setCommand(payload);
        },
        setCommand(payload) {
            this.cmd.payload = payload;
        },
        parseCommand(cmd) {
            // breakdown the  command
            let prop = cmd;
            let val = null;
            let ref = null;

            // check is has value
            if (cmd.indexOf("=") > -1) {
                // command has property and value
                prop = cmd.split("=")[0];
                val = cmd.split("=")[1];
            }

            // find prop from command list
            ref = this.cmd.list.find(el => el.command === prop);

            return {
                prop,
                val,
                ref
            };
        },
        buildCommand({ ref, val }) {
            let hex = "";
            Command.forEach((ele, i) => {
                let el = Command[Command.length - 1 - i];

                switch (el.field) {
                    case "value":
                        if (val === null) {
                            val = 0;
                        }

                        hex = el.format(val) + hex;
                        break;
                    case "subCode":
                    case "code":
                        hex = el.format(ref[el.field]) + hex;
                        break;
                    case "size":
                        hex = el.format(hex) + hex;
                        break;
                    case "crc":
                        hex = el.format(hex) + hex;
                        break;
                    case "prefix":
                        hex = el.format() + hex;
                        break;
                    default:
                        break;
                }
            });

            return hex.toUpperCase();
        },
        executeCommand({ payload, timeout }) {
            let message = null;

            // special commands timeout
            if (payload.includes("GEN_UPGRADE_VCU")) {
                timeout = 4 * 60000;
            } else if (payload.includes("GEN_UPGRADE_HMI")) {
                timeout = 5 * 60000;
            }

            // check is buffer already filled
            if (payload) {
                if (this.theCommand.cmd === null) {
                    // set the command
                    this.setCommand(payload);
                    // parse command
                    let cmd = this.parseCommand(payload);
                    // check command refference
                    if (cmd.ref) {
                        // buffer the command
                        this.SET_THE_COMMAND({
                            unitID: this.theUnit.unitID,
                            hex: this.buildCommand(cmd),
                            payload,
                            timeout,
                            cmd
                        });
                    } else {
                        message = "Command is not registered";
                    }
                } else {
                    message = "Buffer already filled!";
                }
            } else {
                message = "Command can't be empty";
            }

            // show notification
            if (message) {
                this.$q.notify({
                    message
                });
            }
        },
        parseResponse(hexData) {
            let data = [];
            let elCursor = 0;
            // loop for each element
            Response.forEach(el => {
                let valFormat = el.format(
                    hexData.substr(elCursor, el.size * 2)
                );
                // update cursor position
                elCursor += el.size * 2;
                // fill data
                data.push({
                    ...el,
                    value: valFormat,
                    output: el.display(valFormat)
                });
            });
            let code = CommandResponse.find(el => {
                return el.code === data.find(el => el.field === "code").value;
            });

            return {
                unitID: data.find(el => el.field === "unitID").value,
                data,
                hexData,
                payload: this.theCommand.payload,
                code,
                message: data.find(el => el.field === "message").value
            };
        },
        handleResponse({ hexData }) {
            let response = this.parseResponse(hexData);
            // save response
            this.saveResponse(response);
            // process the response
            this.processResponse(response);
            // dismiss loading notifcation
            this.stopWaitting("Command sent.", "positive");
        },
        processResponse(response) {
            // split command message
            let cmd = this.parseCommand(response.payload);
            // process the cmd response
            let result = response.code.title;
            // check response
            if (result === "OK") {
                // check property
                if (cmd.prop === "FINGER_ADD") {
                    this.$q
                        .dialog({
                            title: "Add driver",
                            message: "Name of driver.",
                            preventClose: true,
                            cancel: false,
                            color: "secondary",
                            prompt: {
                                model: "",
                                type: "text"
                            }
                        })
                        .then(data => {
                            this.ADD_FINGERS({
                                unitID: this.theUnit.unitID,
                                fingerID: cmd.val,
                                name: data
                            });
                        });
                } else if (cmd.prop === "FINGER_DEL") {
                    this.DELETE_FINGERS({
                        unitID: this.theUnit.unitID,
                        fingerID: cmd.val
                    });
                } else if (cmd.prop === "FINGER_RST") {
                    this.RESET_FINGERS({
                        unitID: this.theUnit.unitID
                    });
                }
            } else {
                this.$q.notify({
                    message: `Command is ${result}`,
                    type: "negative"
                });
            }
        },
        saveResponse(response) {
            // save command & response
            this.ADD_RESPONSES(response);
        }
    },
    timers: {
        timeoutCommand: { time: 0 }
    }
};
</script>

<style></style>
