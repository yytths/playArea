<template>
  <div class="playArea">
    <h1>お遊技場</h1>
    <h2>何する？？</h2>
    <ul>
      <li>
        <router-link to="reversi">リバーシ</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PlayArea',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
