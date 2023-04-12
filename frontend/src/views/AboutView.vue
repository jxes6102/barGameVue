<template>
  <div class="about">
    <h1 class="italic">This is an about page</h1>
    <div v-for="(item,index) in 100" :key="index">
      <h1 class="italic">{{item +''+ index}}</h1>
    </div>
  </div>
</template>
