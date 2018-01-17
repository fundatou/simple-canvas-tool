// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

new Vue({
  el: '#app',
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
        colorList: ['#ffb400', '#ff69a5', '#906eb3', '#ff376f', '#b60730', '#4ad3f5', '#b0c055'],
        textColor: ['#54341a', '#bc1568', '#59347f', '#a02145', '#611326', '#1e4793', '#4d580d'],
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
          strokeColor: ''
        },
        layoutImageList: ['73', '46', '55', '64', '371'],
        layoutActiveIndex: -1,
        colorActiveIndex: -1,
        showCanvas: false,
        padding: 10,
        imageWidth: 0,// 图片实际尺寸
        imageHeight: 0,
        src: '',
        scale: 1,
        imageX: 0,// 图片的起始坐标
        imageY: 0,
        drawImageWidth: 0,// 画出来的图片的尺寸
        drawImageHeight: 0,
        textX: 0,
        textY: 0,
        textMaxWidth: 0,

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
            if (key === 'color') {
              this.settingObj.strokeColor = this.textColor[index];
            }
          } else {
              this.settingObj.fontSize = this.fontSizeList[index];
          }
      },
      layoutStyleObj(index) {
        let style = {
            'background': `url(./assets/${this.layoutImageList[index]}.png) center / 120px 70px` 
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
        let imageWidth = this.imageWidth;  
        let imageHeight = this.imageHeight;
        let settingObj = this.settingObj;
        let canvasWidth = settingObj.size.width;  // 画布大小
        let canvasHeight = settingObj.size.height;
        let part1 = settingObj.layout.part1;
        let part2 = settingObj.layout.part2;
        let type = settingObj.layout.type;
        let leftOrTop = part1 < part2;
        let fontSize = settingObj.fontSize;
        if (type) {
          this.imageY = leftOrTop ? this.padding : canvasHeight * part1;
          this.drawImageHeight = canvasHeight * (leftOrTop ? part1 : part2) - this.padding;
          // 图片等比缩放 
          this.drawImageWidth = this.drawImageHeight * imageWidth / imageHeight; 
          this.imageX = (canvasWidth - this.drawImageWidth) / 2;

          this.textY = leftOrTop ? (canvasHeight * part2 - this.padding - fontSize * 2) / 2 + canvasHeight * part1 : (canvasHeight * part1 - this.padding - fontSize * 2) / 2;
          this.textX = canvasWidth / 2;
          this.textMaxWidth = canvasWidth - 2 * this.padding;
        } else {
          this.imageX = leftOrTop ? this.padding : canvasWidth * part1;
          this.drawImageWidth = canvasWidth * (leftOrTop ? part1 : part2) - this.padding;
          this.drawImageHeight = this.drawImageWidth * imageHeight / imageWidth; 
          this.imageY = (canvasHeight - this.drawImageHeight) / 2;

          this.textX = leftOrTop ? canvasWidth * part1 + canvasWidth * part2 / 2 : canvasWidth * part1 / 2;
          this.textY = (canvasHeight - this.padding - fontSize * 2) / 2;
          this.textMaxWidth = canvasWidth * (leftOrTop ? part2 : part1) - 2 * this.padding;
        }
        this.showCanvas = true;
        this.draw();
      },
      draw() {
        let imageX = this.imageX;// 图片的起始坐标
        let imageY = this.imageY;
        let drawImageWidth = this.drawImageWidth;// 画出来的图片的尺寸
        let drawImageHeight = this.drawImageHeight;
        let textX = this.textX;
        let textY = this.textY;
        let textMaxWidth = this.textMaxWidth;
        let canvas;
        let ctx;
        let image = new Image();
        let canvasInput;
        let inputCtx;
        let canvasOutput;
        let canvasWidth = this.settingObj.size.width;  // 画布大小
        let canvasHeight = this.settingObj.size.height;
        let fontSize = this.settingObj.fontSize;
        this.$nextTick(() => {
          canvasInput = this.$refs.canvasInput;
          canvasOutput = this.$refs.canvasOutput;

          canvasInput.width = this.imageWidth;
          canvasInput.height = this.imageHeight;
          inputCtx = canvasInput.getContext('2d');

          canvas = this.$refs.canvas;
          canvas.width= canvasWidth;
          canvas.height= canvasHeight;
          ctx = canvas.getContext('2d');

          ctx.fillStyle = this.settingObj.color;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          image.src = this.settingObj.imgSource;
          image.onload = () => {
              inputCtx.drawImage(image, 0, 0, this.imageWidth, this.imageHeight);
              
              ctx.font = `${fontSize}px font`;
              ctx.textBaseline = "hanging";
              ctx.textAlign = 'center';
              ctx.fillStyle = "#fff";
              ctx.fillText(this.settingObj.title1, textX, textY, textMaxWidth);
              ctx.fillText(this.settingObj.title2, textX, textY + fontSize + this.padding, textMaxWidth);
              ctx.strokeStyle = this.settingObj.strokeColor;
              ctx.lineWidth = 2;
              ctx.strokeText(this.settingObj.title1, textX, textY, textMaxWidth);
              ctx.strokeText(this.settingObj.title2, textX, textY + fontSize + this.padding, textMaxWidth);

              let src = cv.imread('canvasInput');
              let dst = new cv.Mat();
              let dsize = new cv.Size(drawImageWidth, drawImageHeight);
              cv.resize(src, dst, dsize, 0.0, 0.0, cv.INTER_AREA);
              cv.imshow('canvasOutput', dst);
              src.delete(); dst.delete();

              ctx.drawImage(canvasOutput, imageX, imageY, drawImageWidth, drawImageHeight);
              this.src = canvas.toDataURL("image/jpg", 1);
          }
        });
      }
  },
});
