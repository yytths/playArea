<template>
  <h1>{{ msg }}</h1>
</template>

<script>
export default {
  name: 'notFound',
  data () {
    return {
      msg: '404 error.'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
  color: red;
}
</style>
