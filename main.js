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
        layoutList: ['73', '46', '55', '64', '371'],
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
            'background': `url(./assets/${this.layoutList[index]}.png) center / 120px 70px` 
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
});
