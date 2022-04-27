<script setup lang="ts">
import arr from '../data/arr.json'
import obj from '../data/obj.json'

import JsonapiNormalizer from '../lib/index'
const arrRes = JsonapiNormalizer.transform(arr)
const objRes = JsonapiNormalizer.transform(obj)
</script>

<template>
    <div class="box">
        <div class="left">
            {{ arrRes }}
        </div>
        <div class="right">
            {{ objRes }}
        </div>
    </div>
</template>
<style>
.box {
    display: flex;
    justify-content: space-between;
}

.left,
.right {
    width: 40%;
    word-break: break-all;
}
</style>


