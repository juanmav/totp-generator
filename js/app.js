function getCurrentSeconds() {
  return Math.round(new Date().getTime() / 1000.0);
}

function stripSpaces(str) {
  return str.replace(/\s/g, '');
}

function truncateTo(str, digits) {
  if (str.length <= digits) {
    return str;
  }

  return str.slice(-digits);
}

new Vue({
  el: '#app',
  data: {
    secret_key: '4QH3BVS5YEAIUA42',
    digits: 6,
    period: 30,
    updatingIn: 0,
    token: null
  },

  mounted: function () {
    this.update();

    this.intervalHandle = setInterval(this.update, 1000);
  },

  destroyed: function () {
    clearInterval(this.intervalHandle);
  },

  computed: {
    totp: function () {
      return new OTPAuth.TOTP({
        algorithm: 'SHA1',
        digits: this.digits,
        period: this.period,
        secret: OTPAuth.Secret.fromB32(stripSpaces(this.secret_key)),
      });
    }
  },

  methods: {
    update: function () {
      this.updatingIn = this.period - (getCurrentSeconds() % this.period);
      this.token = truncateTo(this.totp.generate(), this.digits);
    }
  }
});
