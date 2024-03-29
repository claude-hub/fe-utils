export const gradientColors = {
  /**
   * 获取梯度颜色
   * @param colors 基准颜色 ['rgba(251, 55, 103, 1)','rgb(221, 132, 60)', '#fb3767'] (仅支持这三种颜色格式)
   * @param step   梯度长度
   * @returns ['rgb(0,0,0)','rgb(255,255,255)']
   */
  getGradientColors(colors, step) {
    let temp = [];
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      if (color.indexOf('rgb') >= 0)
        temp.push(this.rgbTo16(color)); //rgba/rgb 颜色格式 转16进制
      else temp.push(color);
    }
    return this.gradientColor(temp, step);
  },
  /**
   * rgba/rgb转16进制
   * @param color
   * @returns {string}
   */
  rgbTo16(color) {
    let values = color
      .replace(/rgba?\(/, '')
      .replace(/\)/, '')
      .replace(/[\s+]/g, '')
      .split(',');
    let a = parseFloat(values[3] || 1),
      r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
      g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
      b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return (
      '#' +
      ('0' + r.toString(16)).slice(-2) +
      ('0' + g.toString(16)).slice(-2) +
      ('0' + b.toString(16)).slice(-2)
    );
  },
  //开始生成梯度盘
  gradientColor(colors, step) {
    let newColors = this.toRgb(colors);
    step = step - 1; //留一个盒子给最后一个颜色
    let newStep = Math.floor(step / (newColors.length - 1)); //两个颜色渐变数量
    let boxDifference = step - newStep * (newColors.length - 1); //重新计算色盘数量是否有step这么多
    let actualStep = 0; //两个颜色实际需要渐变的数量

    let colorArr = [];
    for (let i = 0; i < newColors.length - 1; i++) {
      let sr = newColors[i].r;
      let sg = newColors[i].g;
      let sb = newColors[i].b;

      let er = newColors[i + 1].r;
      let eg = newColors[i + 1].g;
      let eb = newColors[i + 1].b;

      actualStep = newStep;
      if (boxDifference > 0) {
        //当新计算的色盘总数没有满足step的数量,那么将差的色盘补足到每 两个颜色色盘中
        actualStep = newStep + 1;
        boxDifference--;
      }
      let dr = (er - sr) / actualStep; //总差值
      let dg = (eg - sg) / actualStep;
      let db = (eb - sb) / actualStep;

      for (let j = 0; j < actualStep; j++) {
        //计算每一步的hex值
        let hex = this.colorHex(
          'rgb(' +
            parseInt(dr * j + sr) +
            ',' +
            parseInt(dg * j + sg) +
            ',' +
            parseInt(db * j + sb) +
            ')'
        );
        colorArr.push(hex); //当最后两个颜色做渐变时,第一个颜色无法完全渐变成第二个颜色
      }
      if (i == newColors.length - 2) {
        //将最后一个盒子填充成最后一个颜色
        let hex = 'rgb(' + er + ',' + eg + ',' + eb + ')';
        colorArr.push(hex);
      }
    }
    return colorArr;
  },
  //将色盘组中的 16 进制颜色转换成rgb
  toRgb(colors) {
    let temp = [];
    for (let i = 0; i < colors.length; i++) {
      let color = {};
      let rgb = this.colorRgb(colors[i]); //转换为rgb数组模式
      color.r = rgb[0];
      color.g = rgb[1];
      color.b = rgb[2];
      temp.push(color);
    }
    return temp;
  },
  //将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
  colorRgb(sColor) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    sColor = sColor.toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#';
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
      }
      return sColorChange;
    } else {
      return sColor;
    }
  },
  //将rgb表示方式转换为hex表示方式
  colorHex(color) {
    const rgb = color.split(',');
    const r = parseInt(rgb[0].split('(')[1]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2].split(')')[0]);
    const hex =
      '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).substring(1);
    return hex;
  },
};
