const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player') 
const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatbtn= $('.btn-repeat')
// const muteBtn =$('.fa-volume-mute')
// const upvolumeBtn =$('.fa-volume-up')
// const dowvolumeBtn =$('.fa-volume-down')
const rangevolumeBtn = $('#volume-range')


const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {} ,
    songs: [
      {
        name: "À Lôi",
        singer: "Masew",
        path: "./music/ALoi-Double2TMasew.mp3",
        image: "./image/aloi.png"
      },
  
      {
        name: "Tòng phu",
        singer: "Keyo",
        path: "music/TongPhu-KeyoVietNam-7802406.mp3",
        image:
          "./image/tongphu.jpg"
      },
      {
        name: "Wating for you",
        singer: "MONO",
        path:
          "music/WaitingForYou-MONOOnionn-7733882.mp3",
        image: "./image/watingforyou.jpg"
      },
      {
        name: "Tháng tư là lời nói dối của em",
        singer: "Hà Anh Tuấn",
        path: "music/ThangTuLaLoiNoiDoiCuaEm-HaAnhTuan-4609544.mp3",
        image:
          "./image/tháng4lafloinoidoi.jfif"
      },
      {
        name: "Chẳng ai hiểu về tình yêu",
        singer: "Vũ Duy Khánh",
        path: "/music/ChangAiHieuVeTinhYeuXuanTuanRemix-VuDuyKhanh-9790099.mp3",
        image:
          "./image/changaihieu.jfif"
      },
      {
        name: "Vì quá yêu em",
        singer: "Vũ Duy Khánh",
        path: "/music/ViQuaYeuEm-VuDuyKhanhACV-11705933.mp3",
        image:
          "./image/viquayeue.jfif"
      },
      {
        name: "Là Anh",
        singer: "Phạm Lịch",
        path: "./music/LaAnh-PhamLichBMZ-8811329.mp3",
        image:
          "./image/laanh.jfif"
      },
  ],
  setConfig: function(key,value){
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },

  render: function(){
     const htmls = this.songs.map((song,index) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index="${index}">
            <div class="thumb" 
              style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
        `
     })
     playlist.innerHTML = htmls.join('')

  },
  defineProperties: function(){
    Object.defineProperty(this, 'currentSong', {
      get: function(){
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvents: function(){
    const _this = this
    const cdWidth = cd.offsetWidth

      // Xử lý CD quay và dừng
      const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
        duration: 10000, // 10 seconds
        iterations: Infinity
      })
      cdThumbAnimate.pause()

      // Xử lý phóng to/ thu nhỏ CD
      document.onscroll = function(){
       const scrollTop = window.scrollY || document.documentElement.scrollTop  ;
       const newCdWidth = cdWidth - scrollTop

       cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
       cd.style.opacity = newCdWidth/cdWidth
      }

      // Xử lý khi Click Play
      playBtn.onclick = function(){
        if(_this.isPlaying){
          audio.pause()
        }else{
          audio.play()
        }
      }
      // thanh âm lượng
        rangevolumeBtn.oninput = (e) => {
          const currentVolume = e.target.value / 1
          audio.volume = currentVolume
      }  

      // // bật âm lượng
      // upvolumeBtn.onclick = function(){
      //   if (audio.volume < 1.0) {
      //     audio.volume += 0.1; // Tăng âm lượng thêm 0.1
      //   }
      // }
      // // giảm âm lượng
      // dowvolumeBtn.onclick = function(){
      //   if (audio.volume > 0.0) {
      //     audio.volume -= 0.1; // Giảm âm lượng đi 0.1
      //   }
      // }
      // // tắt âm lượng
      // muteBtn.onclick = function(){
      //   audio.volume = 0
      // }

       // Khi bh được playe
       audio.onplay = function(){
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
       }

       // Khi bhat pause
       audio.onpause = function(){
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
       }

       // Khi tiến độ bài hát thay đổi
       audio.ontimeupdate = function(){
         if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
            progress.value = progressPercent
         }
       }

       // Xử lý khi tua
       progress.onchange = function(e){
          const seekTime = audio.duration / 100 * e.target.value
          audio.currentTime =seekTime
       }
        // Khi next bai hat
        nextBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong()
          }else{_this.nextSong()
          }
          audio.play()
          _this.render()
          _this.scrollTopActiveSong()
        }

        // lùi bài hat
        prevBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong()
          }else{_this.prevSong()}
          audio.play()
          _this.render()
          _this.scrollTopActiveSong()
        }

        // bật/ tắt nút chọn bài hát ngẫu nhiên
          randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom) 
          }

          // bật/ tắt nút lặp lại bài hát
          repeatbtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatbtn.classList.toggle('active', _this.isRepeat) 
          }


        // xử lý next song khi audio ended
        audio.onended = function(){
          if(_this.isRepeat){
              audio.play()
          }else{nextBtn.click()}
        }

          // // lắng nghe hành vi click
          playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            // xuử lý khi click vào song
              if(songNode || e.target.closest('.option')) {
                
                  // xử lý vào song
                  if(songNode){
                      _this.currentIndex = Number(songNode.dataset.index)
                      _this.loadCurrentSong();
                      audio.play()
                      _this.render()
                    }

                  //xử lý khi click vào option
                  if(e.target.closest('.option')){

                  }
              }
          }


              
  },
  screenTopAcitveSong: function(){
        setTimeout(() => {
          $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block:'nearest',
          })
        },500)
  }, 

  loadCurrentSong: function(){
      
      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
  },

  loadCongig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
  },

  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong: function(){
    this.currentIndex--
    if(this.currentIndex < 0 ){
      this.currentIndex = this.songs.length -1
    } this.loadCurrentSong()
  },

    playRandomSong: function() {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.songs.length);
      } 
      while (newIndex === this.currentIndex);
  
      this.currentIndex = newIndex;
      this.loadCurrentSong()
    },

  
  start: function(){
    //gan cau hinh tu config vaof ung dung
    this.loadCongig()
    // định nghĩa các thuộc tính cho object
    this.defineProperties()

      // Lắng nghe/ xử lý các sự kiện(dom events)
    this.handleEvents()

    // tải thông tin bài hát đầu tiên vào UI khi chạy app
    this.loadCurrentSong()
    
    //render playlist
    this.render()

      // hien thi trang thai ban dau cua random va repeat
    repeatbtn.classList.toggle('active', this.isRepeat) 
    randomBtn.classList.toggle('active', this.isRandom)
  }
}
app.start()
