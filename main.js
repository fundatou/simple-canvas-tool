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
        scale2: 1,
        drawImageWidth: 0,// 画出来的图片的尺寸
        drawImageHeight: 0,
        textX: 0,
        textY: 0,
        textMaxWidth: 0,
        showScaleBtn: false,
        ctx: null,
        canvasInput: null,
        inputCtx: null,
        imageCenterX: 0, // 图片中心坐标
        imageCenterY: 0,
        imageX: 0,
        imageY: 0,
        isDragging: false,
        sWidth2: 0,
        sHeight2: 0,
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
          this.drawImageHeight = canvasHeight * (leftOrTop ? part1 : part2) - this.padding;
          this.imageY = leftOrTop ? this.padding : canvasHeight * part1;
          this.imageCenterY = this.imageY + this.drawImageHeight / 2;
          // 图片等比缩放 
          this.drawImageWidth = this.drawImageHeight * imageWidth / imageHeight; 
          this.imageX = (canvasWidth - this.drawImageWidth) / 2;
          this.imageCenterX = canvasWidth / 2;

          this.textY = leftOrTop ? (canvasHeight * part2 - this.padding - fontSize * 2) / 2 + canvasHeight * part1 : (canvasHeight * part1 - this.padding - fontSize * 2) / 2;
          this.textX = canvasWidth / 2;
          this.textMaxWidth = canvasWidth - 2 * this.padding;
        } else {
          this.drawImageWidth = canvasWidth * (leftOrTop ? part1 : part2) - this.padding;
          this.imageX = leftOrTop ? this.padding : canvasWidth * part1;
          this.imageCenterX = this.imageX + this.drawImageWidth / 2;
          this.drawImageHeight = this.drawImageWidth * imageHeight / imageWidth; 
          this.imageY = (canvasHeight - this.drawImageHeight) / 2;
          this.imageCenterY = canvasHeight / 2;

          this.textX = leftOrTop ? canvasWidth * part1 + canvasWidth * part2 / 2 : canvasWidth * part1 / 2;
          this.textY = (canvasHeight - this.padding - fontSize * 2) / 2;
          this.textMaxWidth = canvasWidth * (leftOrTop ? part2 : part1) - 2 * this.padding;
        }
        this.showCanvas = true;
        this.draw();
      },
      draw() {
        let canvas;
        let ctx;
        let canvasWidth = this.settingObj.size.width;  // 画布大小
        let canvasHeight = this.settingObj.size.height;
        let fontSize = this.settingObj.fontSize;
        
        this.$nextTick(() => {
          canvas = this.$refs.canvas;
          canvas.width= canvasWidth;
          canvas.height= canvasHeight;
          ctx = canvas.getContext('2d');

          ctx.fillStyle = this.settingObj.color;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          ctx.font = `${fontSize}px font`;
          ctx.textBaseline = "hanging";
          ctx.textAlign = 'center';
          ctx.strokeStyle = this.settingObj.strokeColor;
          ctx.lineWidth = 2;

          this.ctx = ctx;
          this.drawImage();
          this.showScaleBtn = true;
        });
      },
      drawImage() {
        let drawImageWidth = this.drawImageWidth * this.scale;// 画出来的图片的尺寸
        let drawImageHeight = this.drawImageHeight * this.scale;
        let imageX = this.imageCenterX - drawImageWidth / 2;// 图片的起始坐标
        let imageY = this.imageCenterY - drawImageHeight / 2;
        let sx = imageX > 0 ? 0 : -imageX;
        let sy = imageY > 0 ? 0 : -imageY;
        let sWidth = (drawImageWidth - sx) > this.settingObj.size.width ? this.settingObj.size.width : drawImageWidth - sx;
        let sHeight = (drawImageHeight - sy) > this.settingObj.size.height ? this.settingObj.size.height : drawImageHeight - sy;
        imageX = imageX > 0 ? imageX : 0;
        imageY = imageY > 0 ? imageY : 0;
        let textX = this.textX;
        let textY = this.textY;
        let textMaxWidth = this.textMaxWidth;
        let image = new Image();
        let scale = this.scale;
        let canvasOutput;
        let inputCtx = this.inputCtx;
        let fontSize = this.settingObj.fontSize;
        image.src = this.settingObj.imgSource;
        image.onload = () => {
          if (!this.canvasInput) {
            this.canvasInput = this.$refs.canvasInput;
            this.canvasInput.width = this.imageWidth;
            this.canvasInput.height = this.imageHeight;
            inputCtx = canvasInput.getContext('2d');
            inputCtx.drawImage(image, 0, 0, this.imageWidth, this.imageHeight);
          }

          canvasOutput = this.$refs.canvasOutput;
          canvasOutput.getContext('2d').clearRect(0, 0, this.drawImageWidth * this.scale2, this.drawImageHeight * this.scale2);

          let src = cv.imread('canvasInput');
          let dst = new cv.Mat();
          let dsize = new cv.Size(drawImageWidth, drawImageHeight);
          cv.resize(src, dst, dsize, 0.0, 0.0, cv.INTER_AREA);
          cv.imshow('canvasOutput', dst);
          src.delete();
          dst.delete();
          
          // 有时候清除不彻底会有一条白边 
          this.ctx.clearRect(this.imageX, this.imageY, this.sWidth2, this.sHeight2);
          this.ctx.fillStyle = this.settingObj.color;
          this.ctx.fillRect(this.imageX, this.imageY, this.sWidth2 + 1, this.sHeight2 + 1);

          this.ctx.drawImage(canvasOutput, sx, sy, sWidth, sHeight, imageX, imageY, sWidth, sHeight);
          this.ctx.fillStyle = "#fff";
          this.ctx.fillText(this.settingObj.title1, textX, textY, textMaxWidth);
          this.ctx.fillText(this.settingObj.title2, textX, textY + fontSize + this.padding, textMaxWidth);
          this.ctx.strokeText(this.settingObj.title1, textX, textY, textMaxWidth);
          this.ctx.strokeText(this.settingObj.title2, textX, textY + fontSize + this.padding, textMaxWidth);
          this.scale2 = this.scale;
          this.sWidth2 = sWidth;
          this.sHeight2 = sHeight;
          this.imageX = imageX;
          this.imageY = imageY;
          this.src = this.$refs.canvas.toDataURL("image/jpg", 1);
        }
      },
      dragStart(e) {
        this.isDragging = true;
        console.log(e);
      },
      draging(e) {
        if (this.isDragging) {
          console.log(e);
        }
      },
      dragEnd(e) {
        if (this.isDragging) {
          console.log(e);
          this.isDragging = false;
        }
      },
  },
});
