<script>
  export default {
    name: 'LogoutCallback',
    async beforeMount() {
      this.$router.replace({
        path: '/'
      })
    },
    render () {}
  }
</script>
