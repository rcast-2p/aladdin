<template>
  <v-row no-gutters class="py-2">
    <v-col cols="1">time</v-col>
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field
            label="xy repeat num"
            v-model.number="sCom.xyRepeatNum"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="xyz repeat num"
            v-model.number="sCom.xyzRepeatNum"
            type="number"
            outlined
            hide-details="auto"
            dense
            readonly
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="aom open us"
            v-model.number="sCom.aomOpenUs"
            suffix="us"
            outlined
            type="number"
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="3" v-for="(_, sI) in sSpeed" :key="sI">
          <v-text-field
            :label="sI + ' speed / pixel dwell time'"
            v-model.number="sSpeed[sI]"
            suffix="us"
            outlined
            type="number"
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="sampling rate"
            v-model.number="config.samplingRate"
            suffix="MHz"
            outlined
            type="number"
            hide-details="auto"
            dense
          /> </v-col
      ></v-row>
    </v-col>
  </v-row>
</template>
