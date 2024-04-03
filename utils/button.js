import { scaleX, scaleY } from './global';
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

export function drawRoundedRectWithTail(context, x, y, width, height, borderRadius, tailWidth, tailHeight) {
  context.save();
  // 绘制圆角矩形的基本部分
  context.beginPath();
  context.moveTo(x + borderRadius, y);
  context.lineTo(x + width - borderRadius, y);
  context.lineTo(x + width - 4, y + height / 2 - tailHeight / 2);
  context.lineTo(x + width + tailWidth - 4, y + height / 2);
  context.lineTo(x + width, y + height - borderRadius);
  context.lineTo(x + width - 4, y + height / 2 + tailHeight / 2);
  context.lineTo(x + borderRadius, y + height);
  context.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
  context.lineTo(x, y + borderRadius);
  context.arcTo(x, y, x + borderRadius, y, borderRadius);
  context.closePath();
  context.restore();
}