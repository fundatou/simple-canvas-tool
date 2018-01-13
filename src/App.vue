<template>
    <div id="app">
        <h2>CPC生成工具</h2>
        <div class="setting-row">
            <label class="label">标题第一行</label>
            <div class="content">
                <input type="text" maxlength="6" v-model="settingObj.title1"/>
                <span class="attention">六个字以内</span>
            </div>
        </div>
        <div class="setting-row">
            <label class="label">标题第二行</label>
            <div class="content">
                <input type="text" maxlength="6" v-model="settingObj.title2"/>
                <span class="attention">六个字以内</span>
            </div>
        </div>
        <div class="setting-row">
            <label class="label">素材图</label>
            <div class="avatar-uploader content" @click="showImgBox">
                <img v-if="settingObj.imgSource" :src="settingObj.imgSource" class="avatar">
                <span v-else class="avatar-uploader-icon">+</span>
                <input style="visibility: hidden" type="file" accept=".jpg, .jpeg, .png" ref="img" @change="uploadImg" />
            </div>
        </div>
        <div class="setting-row">
            <label class="label">布局</label>
            <div class="content">
                <div class="layout" :class="{active: index === layoutActiveIndex}" v-for="(layout, index) in layoutList" :key="index" :style="layoutStyleObj(index)" @click="check(layout, 'layout', index)"></div>
            </div>
        </div>
        <div class="setting-row">
            <label class="label">背景色</label>
            <div class="content">
                <div class="color" :class="{active: index === colorActiveIndex}" v-for="(color, index) in colorList" :key="color" :style="colorStyleObj(color)" @click="check(color, 'color', index)"></div>
            </div>
        </div>
        <div class="setting-row">
            <label class="label">生成尺寸</label>
            <div class="content">
              <label class="radio" v-for="(size, index) in sizeList" :key="index"><input name="size" type="radio" @click="check(size, 'size', index)" />{{size.width}}px*{{size.height}}px</label> 
            </div>
        </div>
        <button class="button" type="button" @click="create">生成</button>
        <div class="canvas" v-if="showCanvas">
            <canvas ref="canvas"></canvas>
            <a id="download" :href="src" download="shopQrcode.jpg">下载图片</a>
        </div>
    </div>
</template>

<script>

export default {
    name: 'app',
    data() {
        return {
            sizeList: [
                {
                    width: 640,
                    height: 400
                },
                {
                    width: 360,
                    height: 180
                },
                {
                    width: 800,
                    height: 500
                }
            ],
            colorList: ['#dfece0', '#ece7df', '#dfece1'],
            layoutList: [
              {
                type: 0,
                part1: 0.7,
                part2: 0.3
              },
              {
                type: 0,
                part1: 0.4,
                part2: 0.6
              },
              {
                type: 0,
                part1: 0.5,
                part2: 0.5
              },
              {
                type: 0,
                part1: 0.6,
                part2: 0.4
              },
              {
                type: 1,
                part1: 0.3,
                part2: 0.7
              },
            ],
            fontSizeList: [64, 36, 76],
            settingObj: {
              title1: '',
              title2: '',
              imgSource: '',
            },
            layout1: require('./assets/73.png'),
            layout2: require('./assets/46.png'),
            layout3: require('./assets/55.png'),
            layout4: require('./assets/64.png'),
            layout5: require('./assets/371.png'),
            layoutActiveIndex: -1,
            colorActiveIndex: -1,
            showCanvas: false,
            padding: 10,
            imageWidth: 0,
            imageHeight: 0,
            src: ''
        }
    },
    methods: {
        uploadImg(e) {
            let imgFile = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onload = (e) => {
                let data = e.target.result;
                let image = new Image();
                image.onload = () => {
                    this.settingObj.imgSource = data;
                    this.imageWidth = image.width;
                    this.imageHeight = image.height;
                };
                image.src = data;
            };
        },
        showImgBox() {
            this.$refs.img.click();
        },
        check(value, key, index) {
            this.settingObj[key] = value;
            if (key !== 'size') {
              this[`${key}ActiveIndex`] = index;
            } else {
                this.settingObj.fontSize = this.fontSizeList[index];
            }
        },
        layoutStyleObj(index) {
          let style = {
              'background': `url(${this[`layout${index + 1}`]}) center / 120px 70px` 
          };
          return style;
        },
        colorStyleObj(color) {
          let style = {
              'background': color
          };
          return style;
        },
        create() {
          let imageX; // 图片的起始坐标
          let imageY;
          let drawImageWidth; // 画出来的图片的尺寸
          let drawImageHeight;
          let imageWidth = this.imageWidth;  // 图片实际尺寸
          let imageHeight = this.imageHeight;
          let textX;
          let textY;
          let textMaxWidth;
          let settingObj = this.settingObj;
          let canvasWidth = settingObj.size.width;  // 画布大小
          let canvasHeight = settingObj.size.height;
          let part1 = settingObj.layout.part1;
          let part2 = settingObj.layout.part2;
          let type = settingObj.layout.type;
          let leftOrTop = part1 < part2;
          let canvas;
          let ctx;
          let image = new Image();
          let fontSize = settingObj.fontSize;
          if (type) {
            imageY = leftOrTop ? this.padding : canvasHeight * part1;
            drawImageHeight = canvasHeight * (leftOrTop ? part1 : part2) - this.padding;
            // 图片等比缩放 
            drawImageWidth = drawImageHeight * imageWidth / imageHeight; 
            imageX = (canvasWidth - drawImageWidth) / 2;

            textY = leftOrTop ? (canvasHeight * part2 - this.padding - fontSize * 2) / 2 + canvasHeight * part1 : (canvasHeight * part1 - this.padding - fontSize * 2) / 2;
            textX = canvasWidth / 2;
            textMaxWidth = canvasWidth - 2 * this.padding;
          } else {
            imageX = leftOrTop ? this.padding : canvasWidth * part1;
            drawImageWidth = canvasWidth * (leftOrTop ? part1 : part2) - this.padding;
            drawImageHeight = drawImageWidth * imageHeight / imageWidth; 
            imageY = (canvasHeight - drawImageHeight) / 2;

            textX = leftOrTop ? canvasWidth * part1 + canvasWidth * part2 / 2 : canvasWidth * part1 / 2;
            textY = (canvasHeight - this.padding - fontSize * 2) / 2;
            textMaxWidth = canvasWidth * (leftOrTop ? part2 : part1) - 2 * this.padding;
          }
          this.showCanvas = true;
          this.$nextTick(() => {
            canvas = this.$refs.canvas;
            canvas.width= canvasWidth;
            canvas.height= canvasHeight;
            ctx = canvas.getContext('2d');

            // ctx.imageSmoothingEnabled = false;
            // ctx.mozImageSmoothingEnabled = false;
            // ctx.webkitImageSmoothingEnabled = false;
            // ctx.msImageSmoothingEnabled = false;

            ctx.fillStyle = this.settingObj.color;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            image.src = settingObj.imgSource;
            image.onload = () => {
                ctx.drawImage(image, imageX, imageY, drawImageWidth, drawImageHeight);
                
                ctx.font = `${fontSize}px zaoZiGongFang`;
                ctx.textBaseline = "hanging";
                ctx.textAlign = 'center';
                ctx.fillStyle = "#212121";
                ctx.fillText(settingObj.title1, textX, textY, textMaxWidth);
                ctx.fillText(settingObj.title2, textX, textY + fontSize + this.padding, textMaxWidth);
                this.src = canvas.toDataURL("image/jpg", 1);
            }
          });
        }
    },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-left: 30px;
}

h2 {
  border-bottom: 1px solid #212121;
}

.setting-row {
  margin: 10px 0;
}

.label {
  display: inline-block;
  font-size: 14px;
  width: 100px;
  text-align: right;
  vertical-align: top;
}

.content {
  display: inline-block;
  margin-left: 20px;
}

.layout {
  width: 120px;
  height: 70px;
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
}

.color {
  width: 40px;
  height: 40px;
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
}

.picture-delete {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
}

.avatar-uploader {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 200px;
      height: 200px;
      line-height: 200px;
      text-align: center;
}
.avatar-uploader:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
}
.avatar {
    width: 200px;
    height: 200px;
    display: block;
}

.attention {
  font-size: 10px;
}

.radio {
  margin-right: 10px;
}

.button {
  margin-top: 20px;
  margin-left: 120px;
  cursor: pointer;
}

.active {
  border: 2px solid #03a9f4;
}

.canvas {
  margin-left: 120px;
  margin-top: 20px;
}

@font-face {
    font-family: 'zaoZiGongFang';
    src: url("./assets/zaozigongfangmodeng.ttf") format('truetype');
}
</style>
