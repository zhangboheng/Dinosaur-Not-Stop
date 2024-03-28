import { systemInfo, scaleX, scaleY } from './global';
// 带有描边的提示框
export function drawDialog(context, text, options = {}) {
  const {
    width = 200, height = 100, backgroundColor = '#f5d659', borderColor = 'black', borderWidth = 3, textColor = 'black', fontSize = '20px', fontFamily = 'Arial', scores = [0,0,0,0,0,0,0,0,0,0]
  } = options;
  const canvasWidth = context.canvas.width / systemInfo.devicePixelRatio;
  const canvasHeight = context.canvas.height / systemInfo.devicePixelRatio;
  const dialogX = (canvasWidth - width) / 2;
  const dialogY = (canvasHeight - height) / 2;
  // 绘制背景
  context.save();
  context.fillStyle = backgroundColor;
  context.strokeStyle = borderColor;
  context.lineWidth = borderWidth;
  context.fillRect(dialogX, dialogY, width, height);
  context.strokeRect(dialogX, dialogY, width, height);
  // 绘制文本
  context.fillStyle = textColor;
  context.font = `bold ${fontSize} ${fontFamily}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvasWidth / 2, dialogY + 20 * scaleY);
  let textY = dialogY + 50 * scaleY;
  context.font = `bold ${16 * scaleX}px ${fontFamily}`;
  try {
    for (let i = 0; i < JSON.parse(scores).length; i++) {
      context.textAlign = 'left';
      context.fillText(`TOP ${i + 1}`, dialogX + 10, textY);
      context.textAlign = 'right';
      context.fillText(`${JSON.parse(scores)[i]}`, dialogX + width - 10, textY);
      textY += 30 * scaleY;
    }
  }catch(e){
    for (let i = 0; i < scores.length; i++) {
      context.textAlign = 'left';
      context.fillText(`TOP ${i + 1}`, dialogX + 10, textY);
      context.textAlign = 'right';
      context.fillText(`${scores[i]}`, dialogX + width - 10, textY);
      textY += 30 * scaleY;
    }
  }
  // 绘制关闭按钮
  const closeButtonSize = 20 * scaleX; // 关闭按钮的尺寸
  const closeButtonX = dialogX + width - 10;
  const closeButtonY = dialogY;
  context.fillStyle = 'black'; // 设置关闭按钮的颜色
  context.textAlign = 'right';
  context.font = `${closeButtonSize}px Arial`; // 设置关闭按钮的字体大小
  context.fillText('X', closeButtonX, closeButtonY + 20 * scaleY);
  context.restore();

  // 返回关闭按钮的坐标和尺寸信息，用于点击检测
  return {
    closeButtonX,
    closeButtonY,
    closeButtonSize
  };
}

// 矩形提示框
export function showBoxMessage(context, message, x, y, backgroundColor = '#f5d659', strokeColor = 'black', fontSize = 'bold 20px') {
  context.save();
  // 设置文本样式
  context.fillStyle = backgroundColor;
  context.strokeStyle = strokeColor;
  context.lineWidth = 3;
  context.font = 'bold 20px';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  // 绘制文本背景
  const padding = 60; // 边距宽度
  const textWidth = context.measureText(message).width + padding * 2;
  const textHeight = 60; // 提示框的高度，可以根据需要调整
  context.fillRect(x - textWidth / 2, y - textHeight / 2, textWidth, textHeight);
  context.strokeRect(x - textWidth / 2, y - textHeight / 2, textWidth, textHeight);
  // 绘制文本
  context.fillStyle = 'black';
  context.fillText(message, x, y + 2);
  context.restore();
}