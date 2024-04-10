import { menuButtonInfo, scaleX, scaleY } from './global';
// 带有描边的按钮公共方法
export function drawRoundedRect(context, x, y, width, height, radius, fillColor, strokeColor, strokeWidth) {
  context.save();
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  // 填充
  context.fillStyle = fillColor;
  context.fill();
  // 描边
  if (strokeColor && strokeWidth) {
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.stroke();
  }
  context.restore();
}
// 图片返回按钮的公共方法
export function createBackButton(context, x, y, imagePath, callback) {
  const image = new Image();
  image.src = imagePath;
  const button = {
    x,
    y,
    width: 32,
    height: 32,
    image,
    onClick: callback
  };

  image.onload = () => {
    button.width = image.width;
    button.height = image.height;
    context.drawImage(image, x, y);
  };

  return button;
}
// 带有图标的返回按钮公共方法
export function drawIconButton(context, text, x, y, callback) {
  context.save();
  // 设置文本样式
  context.fillStyle = '#f5d659';
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  // 绘制文本背景
  const padding = 60 * scaleX; // 边距宽度
  const boxWidth = context.measureText(text).width + padding * 2;
  const boxHeight = 60 * scaleY; // 提示框的高度，可以根据需要调整
  context.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);
  context.strokeRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);
  context.restore();
  // 绘制文本;
  context.save();
  context.font = `bold ${16 * scaleX}px Arial`;
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const textY = y + 2 * scaleY; // 垂直居中
  context.fillText(text, x, textY);
  context.restore();
  // 返回按钮尺寸信息
  return {
    x: x - boxWidth / 2,
    y: y - boxHeight / 2,
    width: boxWidth,
    height: boxHeight
  };
}

export function drawRoundedRectNoStrike(ctx, x, y, width, height, radius, strokeColor, strokeWidth) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  ctx.restore();
}

// 图标下面的文字
export function drawImageBtn(context, rankImage, x = 10, y = menuButtonInfo.top, scaleX, scaleY, text = '成绩榜') {
  const imageSize = {
    width: 32 * scaleY,
    height: 32 * scaleY
  };

  if (rankImage.complete) {
    context.drawImage(rankImage, x, y, imageSize.width, imageSize.height);
  }
  context.save();
  context.fillStyle = 'black';
  context.font = `bold ${10 * scaleX}px Arial`;
  context.textAlign = 'center';
  context.fillText(text, x + (imageSize.width) / 2, y + imageSize.height + 10 * scaleX);
  context.restore();

  const imagePosition = {
    x: x,
    y: y,
    width: imageSize.width,
    height: imageSize.height
  };

  return imagePosition;
}