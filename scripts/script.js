new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Top 40 & Pop Music",
          artist: ".977 Today's Hits",
          cover: "https://cdn-radiotime-logos.tunein.com/s48940d.png",
          source: "https://19763.live.streamtheworld.com/977_HITSAAC_SC",
          url: "https://onlineradiobox.com/us/977todayshits/",
          country: "USA",
          favorited: false
        },
        {
          name: "Top 40 & Pop Music",
          artist: "Hot 97.7",
          cover: "https://cdn-profiles.tunein.com/s123480/images/logod.jpg",
          source: "https://kathy.torontocast.com:3785/stream",
          url: "https://onlineradiobox.com/us/hot977/",
          country: "CANADA",
          favorited: false
        },
        {
          name: "Top 40 & Pop Music",
          artist: "100hitz - Top 40 Hitz",
          cover: "https://cdn.onlineradiobox.com/img/l/1/10191.v4.png",
          source: "https://pureplay.cdnstream1.com/6025_128.mp3",
          url: "https://pureplay.cdnstream1.com/6025_128.mp3",
          country: "USA",
          favorited: false
        },
        {
          name: "Hip Hop / R&B",
          artist: ".977 Hip Hop",
          cover: "https://cdn-radiotime-logos.tunein.com/s48940d.png",
          source: "https://playerservices.streamtheworld.com/api/livestream-redirect/977_JAMZ_SC",
          url: "https://playerservices.streamtheworld.com/api/livestream-redirect/977_JAMZ_SC",
          country: "USA",
          favorited: false
        },
        {
          name: "Hip Hop / Pop / Dance / Rock / Indie",
          artist: "BBC Radio 1",
          cover: "https://cdn.onlineradiobox.com/img/l/3/1193.v13.png",
          source: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
          url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
          country: "UK",
          favorited: false
        },
        {
          name: "Bollywood / Pop",
          artist: "Meethi Mirchi Radio",
          cover: "https://cdn.onlineradiobox.com/img/l/4/74904.v11.png",
          source: "https://meethimirchihdl-lh.akamaihd.net/i/MeethiMirchiHDLive_1_1@320572/master.m3u8?hdnts=st=1632289604~exp=1632376004~acl=/*~hmac=f909ee87e3533037b63b76b8917a54a8bdda59bff2163061fa2c2e3ad7959d4c",
          url: "https://meethimirchihdl-lh.akamaihd.net/i/MeethiMirchiHDLive_1_1@320572/master.m3u8?hdnts=st=1632289604~exp=1632376004~acl=/*~hmac=f909ee87e3533037b63b76b8917a54a8bdda59bff2163061fa2c2e3ad7959d4c",
          country: "India",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});
