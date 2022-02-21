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
                    favorited: false,
                },
                {
                    name: "Top 40 & Pop Music",
                    artist: "Hot 97.7",
                    cover: "https://cdn-profiles.tunein.com/s123480/images/logod.jpg",
                    source: "https://kathy.torontocast.com:3785/stream",
                    url: "https://onlineradiobox.com/us/hot977/",
                    country: "CANADA",
                    favorited: false,
                },
                {
                    name: "Top 40 & Pop Music",
                    artist: "100hitz - Top 40 Hitz",
                    cover: "https://cdn.onlineradiobox.com/img/l/1/10191.v4.png",
                    source: "https://pureplay.cdnstream1.com/6025_128.mp3",
                    url: "https://pureplay.cdnstream1.com/6025_128.mp3",
                    country: "USA",
                    favorited: false,
                },
                {
                    name: "Top 40 & Pop Music",
                    artist: "Capital FM",
                    cover: "https://cdn.onlineradiobox.com/img/l/8/1018.v14.png",
                    source: "https://media-ssl.musicradio.com/Capital",
                    url: "https://media-ssl.musicradio.com/Capital",
                    country: "UK",
                    favorited: false,
                },
                {
                    name: "Hip Hop / R&B",
                    artist: ".977 Hip Hop",
                    cover: "https://cdn-radiotime-logos.tunein.com/s48940d.png",
                    source: "https://playerservices.streamtheworld.com/api/livestream-redirect/977_JAMZ_SC",
                    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/977_JAMZ_SC",
                    country: "USA",
                    favorited: false,
                },
                {
                    name: "Hip Hop / R&B",
                    artist: "Hot 108 Jamz",
                    cover: "https://cdn-profiles.tunein.com/s18733/images/logod.png?t=636251",
                    source: "http://sc.hot108.com:4000/",
                    url: "http://sc.hot108.com:4000/",
                    country: "USA",
                    favorited: false,
                },
                {
                    name: "Bollywood / Pop",
                    artist: "Radio Mirchi",
                    cover: "https://liveradios.in/wp-content/uploads/RadioMirchi-logo.jpg",
                    source: "https://eu8.fastcast4u.com/proxy/clyedupq/?mp=/1",
                    url: "https://eu8.fastcast4u.com/proxy/clyedupq/?mp=/1",
                    country: "India",
                    favorited: false,
                },
            ],
            currentTrack: null,
            currentTrackIndex: 0,
            transitionName: null,
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
                if (this.isTimerPlaying) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            }, 300);
        },
        favorite() {
            this.tracks[this.currentTrackIndex].favorited = !this.tracks[this.currentTrackIndex].favorited;
        },
    },
    created() {
        let vm = this;
        this.currentTrack = this.tracks[0];
        this.audio = new Audio();
        this.audio.src = this.currentTrack.source;
        this.audio.ontimeupdate = function () {
            vm.generateTime();
        };
        this.audio.onloadedmetadata = function () {
            vm.generateTime();
        };
        this.audio.onended = function () {
            vm.nextTrack();
            this.isTimerPlaying = true;
        };

        // this is optional (for preload covers)
        for (let index = 0; index < this.tracks.length; index++) {
            const element = this.tracks[index];
            let link = document.createElement("link");
            link.rel = "prefetch";
            link.href = element.cover;
            link.as = "image";
            document.head.appendChild(link);
        }
    },
});
